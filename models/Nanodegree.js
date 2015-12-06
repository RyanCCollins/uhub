var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Nanodegree = new keystone.List('Nanodegree', {
	track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

Nanodegree.add({
	name: { type: String, required: true },
	logo: { type: Types.CloudinaryImage },
	description: {type: Types.Markdown, height: 200},
	link: {type: Types.Url }
});


/**
 * Relationships
 * =============
 */

Nanodegree.relationship({ ref: 'ProjectCategory', refPath: 'categories', path: 'projectcategories' });
Nanodegree.relationship({ ref: 'User', refPath: 'author', path: 'enrollments'});

/**
 * Registration
 * ============
 */

Nanodegree.register();