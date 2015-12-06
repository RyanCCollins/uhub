var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var ProjectCategory = new keystone.List('ProjectCategory', {
	track: true,
	autokey: { from: 'title', path: 'key', unique: true },
	map: { name: 'title' }
});

ProjectCategory.add({
	nanodegree: { type: Types.Relationship, ref: 'Nanodegree', required: true, initial: true },
	title: { type: String, required: true, initial: true }
});


/**
 * Relationships
 * =============
 */

//ProjectCategory.relationship({ ref: 'Nanodegree', refPath: 'categories', path: 'nanodegrees' });


/**
 * Registration
 * ============
 */

ProjectCategory.register();