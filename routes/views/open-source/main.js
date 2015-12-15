var keystone = require('keystone'),
	_ = require('underscore');

var User = keystone.list('User');
var Team = keystone.list('Team');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'open-source';
	locals.page.title = 'Open Source Teams and Projects';


	// Load Users
	view.on('init', function(next) {
		User.model.find()
		.sort('name.first')
		.where('isPublic', true)
		.where('teams').gt(0)
		.exec(function(err, users) {
			if (err) res.err(err);
			locals.users = users;
			next();
		});
	});

	// Load Teams

	view.on('init', function(next) {
		Team.model.find()
		.sort('-createdAt')
		.populate('members')
		.exec(function(err, teams) {
			if (err) res.err(err);
			locals.teams = teams;
			next();
		});
	});

	// //Find team leaders
	// view.on('init', function(next) {
	// 	Team.model.find()
	// 	.sort('name.first')
	// 	.where('isPublic', true)
	// 	.where('teams').gt(0)
	// 	.exec(function(err, users) {
	// 		if (err) res.err(err);
	// 		locals.users = users;
	// 		next();
	// 	});
	// });

	// // Pluck IDs for filtering Community

	// view.on('init', function(next) {
	// 	locals.leaderIds = _.pluck(locals.teams, 'id');
	// 	locals.speakerIDs = _.pluck(locals.users, 'id');
	// 	next();
	// });


	// // Load Community

	// view.on('init', function(next) {
	// 	User.model.find()
	// 	.sort('-lastRSVP')
	// 	.where('isPublic', true)
	// 	.where('_id').nin(locals.organiserIDs)
	// 	.where('_id').nin(locals.speakerIDs)
	// 	.exec(function(err, community) {
	// 		if (err) res.err(err);
	// 		locals.community = community;
	// 		next();
	// 	});
	// });


	view.render('site/open-source');
}
