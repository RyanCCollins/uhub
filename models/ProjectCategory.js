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
	name: { type: String, required: true },
	nanodegree: { type: Types.Relationship, ref: 'Nanodegree', toMany: false}
});


/**
 * Relationships
 * =============
 */

ProjectCategory.relationship({ ref: 'Nanodegree', refPath: 'categories', path: 'projectcategories' });


/**
 * Registration
 * ============
 */

ProjectCategory.register();