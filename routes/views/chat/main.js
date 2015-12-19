var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	Room = keystone.list('ChatRoom'),
	Team = keystone.list('Team'),
	User = keystone.list('User');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'chat';
	locals.page.title = 'Open Source Projects and Teams';

	locals.data = {
		rooms: {},
		teams: {}
	};
	
	// Load the rooms
	view.on('init', function(next) {
		
		var q = Room.model.find()
		.populate('users leaders team')
		.limit(10)
		.exec(function(err, rooms) {
			if (err || !rooms.length) {
				return next(err);
			}

        	console.log(rooms);
			locals.data.rooms = rooms;
			next(err);
		});
		
	});

	// 		// Load all teams
	// view.on('init', function(next) {
		
	// 	keystone.list('Team').model.find().sort('name').exec(function(err, results) {
			
	// 		if (err || !results.length) {
	// 			return next(err);
	// 		}
			
	// 		locals.data.teams = results;
			
	// 	// 	// Load the counts for each category
	// 	// 	async.each(locals.data.categories, function(category, next) {
				
	// 	// 		keystone.list('Post').model.count().where('category').in([category.id]).exec(function(err, count) {
	// 	// 			category.postCount = count;
	// 	// 			next(err);
	// 	// 		});
				
	// 	// 	}, function(err) {
	// 	// 		next(err);
	// 	// 	});
			
	// 	 });

	// Render the view
	view.render('chat/main');
	
}






