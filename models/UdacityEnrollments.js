var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Udacity Profile Model
 * ===================
 */

var UdacityEnrollment = new keystone.List('UdacityEnrollment', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

UdacityEnrollment.add({
	key: { type: String, index: true },
	title: String ,
	quiz_count: Number,
	completed: Boolean,
	description: { type: Types.Markdown },
	location: Types.Location
});


/**
 * Relationships
 * =============
 */

UdacityEnrollment.relationship({ ref: 'User', refPath: 'organisation', path: 'members' });


/**
 * Registration
 * ============
 */

UdacityEnrollment.defaultColumns = 'key, title, completed';
UdacityEnrollment.register();