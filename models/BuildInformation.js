var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * BuildInformation Model
 * ===========
 */

var BuildInformation = new keystone.List('BuildInformation', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true },
	hidden: true
});

BuildInformation.add({
	build: { type: String, required: true, initial: true},
	info: { type: String, required: true, initial: true},
	state: { type: Types.Select, options: ['Passed', 'Failed'], default: true, initial: true},
	branch: {type: String, default: 'Master', initial: true},
	message: {type: String, initial: true },
	commitId: {type: String, initial: true}
});

BuildInformation.relationship({ ref:'Project', refPath: 'buildInformation', path: 'buildinformation'});

BuildInformation.register();