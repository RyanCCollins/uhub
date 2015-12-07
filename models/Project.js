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

	appetize: { nanodegree.title = 'iOS Developer' || nanodegree.title = 'Android Developer' }
}

Project.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
	about: { type: Types.Markdown, wysiwyg: true, height: 250, 'Tell us all about your project (in Markdown)!' },
	nanodegree: { type: Types.Relationship, ref: 'Nanodegree', toMany: false, required: true, initial: true },
	categories: { type: Types.Relationship, ref: 'ProjectCategory', filters:{ group: ':nanodegree'},  initial: true, drilldown: 'nanodegree'}
}, 'Images', {
	featureImage: { type: Types.CloudinaryImage },
	gallery: { type: Types.CloudinaryImages, note: 'Note: Upload the photo gallery for your project here.  Note: only the first 12 photos will be shown.'}
}, 'Links', {
	downloadURL: { type: Types.Url, required: false, note: 'This is in addition to the github page.  Link to the best place to download the project.'},
	githubURL: { type: Types.Url, required: false, note: 'This will help people download and run your project.  It will also help automate the submission of your project.' },
	appetizeURL: { type: String, required: false, note: 'If your project is an iOS or Android app, you can upload it to Appetize to provide an emulation on the site.', dependsOn: deps.appetize}
});


/**
 * Virtuals
 * ========
 */

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
