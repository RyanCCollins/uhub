var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Project Model
 * ===========
 */

var Project = new keystone.List('Project', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true },
	drilldown: 'author'
});

var deps = {
	appetize: { 'includeAppetizeEmbed' : true },
	appetizeUpload: { 'appetize.upload' : true},
	buildInfo: { 'includeBuildInformation': true },
}

Project.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true, initial: true, filters: { enrollments:':nanodegree'}},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
	briefDescription: { type: String, required: true, initial: true},
	about: { type: Types.Markdown, wysiwyg: true, toolbarOptions: { hiddenButtons: 'H1,H6,Code' }, height: 250, note: 'Tell us all about your project (in Markdown)!' },
	nanodegree: { type: Types.Relationship, ref: 'Nanodegree', toMany: false, required: true, initial: true, filters: { author: ':author' }},
	categories: { type: Types.Relationship, ref: 'ProjectCategory', default: 'Capstone',  initial: true, filters: { nanodegree:':nanodegree' }}
}, 'Build Information', {
	includeBuildInformation: { type: Boolean, default: true},
	//buildInformation: { type: Types.Relationship, ref 'BuildInformation', toMany: false, dependsOn: deps.buildInfo }
	buildInformation: {type: String, dependsOn: deps.buildInfo}
}, 'Images', {
	featureImage: { type: Types.CloudinaryImage },
	gallery: { type: Types.CloudinaryImages, note: 'Note: Upload the photo gallery for your project here.  Note: only the first 12 photos will be shown.'}
}, 'Links', {
	downloadURL: { type: Types.Url, required: false, note: 'This is in addition to the github page.  Link to the best place to download the project.'},
	githubURL: { type: Types.Url, required: false, note: 'This will help people download and run your project.  It will also help automate the submission of your project.' },
	openSource: { type: Boolean, default: true, note: 'Note: If your project is open source, visitors of the site will be able to visit the project page, fork and star it.'}
}, 'Embeds', {
	includeAppetizeEmbed: { type: Boolean, default: false, note: 'Appetize is an interactive way to show off your mobile apps.  For instructions, go to https://appetize.io/docs.'},
	appetize: {
		apiKey: { type: String, required: false, note: '', dependsOn: deps.appetizeURLappetizeUpload },
		device: { type: Types.Select, options: 'iPhone, Android', default: 'iPhone'},
		color: { type: Types.Select, options: 'Black, White', default: 'Black'}
	}
});


/**
 * relationships
 * ========
 */
Project.relationship({ ref: 'ProjectComment', refPath: 'project', path: 'comments' });
Project.relationship({ ref: 'ProjectRating', refPath: 'project', path: 'ratings'});
/**
 * Virtuals
 * ========
 */

Project.schema.virtual('appetizeUrl').get(function() {
	var urlString = 'https://appetize.io/embed/'+ appetize.apiKey +'?device=iPhone6&scale=100&autoplay=false&orientation=portrait&deviceColor=black'
	return urlString;
});
	
/**
 * Notifications
 * =============
 */

Project.schema.methods.notifyAdmins = function(callback) {
	var project = this;
	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {
		if (err) return callback(err);
		async.each(results.admins, function(admin, done) {
			new keystone.Email('admin-notification-new-project').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: project.title,
				keystoneURL: 'http://www.uhub.io/keystone/project/' + project.id,
				subject: 'New project posted to uHub'
			}, {
				to: admin,
				from: {
					name: 'uhub',
					email: 'contact@uhub.io'
				}
			}, done);
		}, callback);
	}
	// Query data in parallel
	async.parallel({
		author: function(next) {
			if (!project.author) return next();
			keystone.list('User').model.findById(project.author).exec(next);
		},
		admins: function(next) {
			keystone.list('User').model.find().where('isAdmin', true).exec(next)
		}
	}, sendEmail);
};

/**
 * Registration
 * ============
 */

Project.defaultSort = '-publishedDate';
Project.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Project.register();
