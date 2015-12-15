var async = require('async');
var crypto = require('crypto');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Users Model
 * ===========
 */

var ChatRoom = new keystone.List('ChatRoom', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true },
	map: { name: 'name'}
});


ChatRoom.add({
	name: { type: String, required: true, index: true },
	isPublic: { type: Boolean, required: true, initial: true, default: false},
	team: { type: Types.Relationship, ref: 'Team', many: false, initial: true, dependsOn: { isPublic: false}},
	topic: { type: String },
	repoURL: { type: Types.Url, required: true, initial: true},
	users: { type: Types.Relationship, ref: 'User', many: true, filters: {teams:':team'}},
	isActive: { type: Types.Boolean, default: true, initial: true, required: true },
	lastActive: { type: Types.Date }
});

ChatRoom.schema.virtual('url').get(function() {
	return '/chats/' + this.key;
});

ChatRoom.defaultColumns = 'name, group, topic';
ChatRoom.register();
