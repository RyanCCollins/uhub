var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Team = new keystone.List('Team', {
	track: true,
	autokey: { from: 'title', path: 'key', unique: true },
	map: { name: 'title' }
});

Team.add({
	title: { type: String, required: true, initial: true, unique: true, note: 'Create a cool team name.  Pick something unique to you!'},
	avatar: { type: Types.CloudinaryImage, autoCleanup : true, select: true, publicID: 'slug'},
	group: {type: Types.Relationship, ref: 'Nanodegree', many: false, required: true, initial: true},
	leaders: { type: Types.Relationship, ref: 'User', many: true, required: true, initial: true }
});

Team.relationship({ ref: 'User', refPath: 'members', path: 'members'});

Team.defaultColumns = 'title, group, leader';
Team.register();