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
	autokey: { path: 'slug', from: 'title', unique: true }
});

var deps = {
	nanodegree: 'nanodegree'
}

Project.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	description: { type: String },
	download: { type: Types.Url, required: false },
	githubURL: { type: Types.Url, required: false },
	appetizeURL: { type: String, required: false },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	nanodegree: { type: Types.Relationship, ref: 'Nanodegree', toMany: false, required: true, initial: true, filters: { group: ':author/:enrollments'} },
	categories: { type: Types.Relationship, ref: 'ProjectCategory', filters:{ group: ':nanodegree'}, default: 'Capstone',  dependsOn: deps.nanodegree}
});

/**
 * Virtuals
 * ========
 */

Project.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
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
