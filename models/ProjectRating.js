var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Comments Model
 * ===================
 */

var ProjectRating = new keystone.List('ProjectRating', {
	nocreate: true,
	track: true
});

ProjectRating.add({
	project: { type: Types.Relationship, ref: 'Project', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	rating: { type: Number, required: true, default: 1 }
});


/**
 * Registration
 * ============
 */

ProjectRating.defaultColumns = 'project, author, date|20%';
ProjectRating.register();
