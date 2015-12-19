var _ = require('underscore');
var async = require('async');
var keystone = require('keystone');
var ChatRoom = keystone.list('ChatRoom');


exports = module.exports = function(req, res) {

	var meetupId = req.params.id;

	var rtn = {
		rooms: {}
	};

	async.series([

		function(next) {
			keystone.list('ChatRoom').model
			.find()
			.populate('users leaders team')
			.limit(10)
			.exec(function(err, rooms) {
				if (err) {
					console.log('Error finding rooms: ', err)
				}
				rtn.rooms = rooms;
				return next();
			});
		},
	], function(err) {
		if (err) {
			rtn.err = err;
		}
		res.json(rtn);
	});
}
