var keystone = require('keystone'),
	_ = require('underscore'),
	async = require('async'),
	moment = require('moment');

// var Meetup = keystone.list('Meetup'),
// 	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'chat';
	locals.page.title = 'Chat - uHub';

	locals.filters = {
		room : req.params.room,
		team : req.params.team,
		sort : req.params.sort
	};

	locals.data = {
		rooms: {},
		teams: {},
		roomTableHeaders: [],
		roomTable: []
	}
	
		// Load all teams
	view.on('init', function(next) {
		
		keystone.list('Team').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.teams = results;
			
		// 	// Load the counts for each category
		// 	async.each(locals.data.categories, function(category, next) {
				
		// 		keystone.list('Post').model.count().where('category').in([category.id]).exec(function(err, count) {
		// 			category.postCount = count;
		// 			next(err);
		// 		});
				
		// 	}, function(err) {
		// 		next(err);
		// 	});
			
		 });
		
	});



	// Load the selected filter
	view.on('init', function(next) {
		
		if (req.params.room) {
			keystone.list('ChatRoom').model.findOne({ key: locals.filters.room }).exec(function(err, result) {
				locals.data.room = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	view.on('init', function(next) {

	var q = keystone.list('ChatRoom').paginate({
            page: req.query.page || 1,
            perPage: 10,
            maxPages: 10
        })
		.where('isPublic', true)
        .sort('-lastActive')
        .populate('team users');

    if (locals.current.team) {
        q.where('team').in([locals.data.team]);
    }


    var sort = locals.current.sort;

    q.sort(sort);

    q.exec(function(err, results) {
        locals.data.pagination = results;
        locals.data.rooms = locals.data.pagination.results;

        for (room in locals.data.rooms) {
        	var pub = room.isPublic ? "Yes" : "No"
        	var q = [room.name, room.topic, room.leader, room.users.count, pub];
        	locals.data.roomTable = q;
        }

        local.data.roomTableHeaders = ["Name", "Topic", "Leader", "Users", "Public"];
        next(err);
    });
});

	view.render('gitter/main');
	
}

