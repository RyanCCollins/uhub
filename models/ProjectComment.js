var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Comments Model
 * ===================
 */

var ProjectComment = new keystone.List('ProjectComment', {
	nocreate: true
});

ProjectComment.add({
	project: { type: Types.Relationship, ref: 'Project', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

ProjectComment.defaultColumns = 'project, author, date|20%';
ProjectComment.register();
