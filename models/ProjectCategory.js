var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var ProjectCategory = new keystone.List('ProjectCategory', {
	track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

ProjectCategory.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

ProjectCategory.relationship({ ref: 'Project', refPath: 'categories', path: 'projects' });


/**
 * Registration
 * ============
 */

ProjectCategory.register();