var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore');

var User = keystone.list('User');
var Team = keystone.list('Team');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'teams';
	locals.page.title = 'Open Source Teams and Projects';

	locals.filters = {
		group: req.params.nanodegree
	}

	locals.current = {
		sort: '-updateAt'
	};

	locals.data = {
		teams: {},
		nanodegrees: {}
	}

	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('Nanodegree').model.find().sort('title').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.nanodegrees = results;
			
			// Load the counts for each category
			async.each(locals.data.nanodegrees, function(nanodegree, next) {
				
				keystone.list('Team').model.count().where('group').in([nanodegree.id]).exec(function(err, count) {
					nanodegree.Count = count;

					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});

	// 	// Load all categories
	// view.on('init', function(next) {
		
	// 	keystone.list('Team').model.find().sort('title').exec(function(err, results) {
			
	// 		if (err || !results.length) {
	// 			return next(err);
	// 		}
			
	// 		locals.data.nanodegrees = results;
			
	// 		// Load the counts for each category
	// 		async.each(locals.data.nanodegrees, function(nanodegree, next) {
				
	// 			keystone.list('Team').model.count().where('group').in([nanodegree.id]).exec(function(err, count) {
	// 				nanodegree.Count = count;

	// 				next(err);
	// 			});
				
	// 		}, function(err) {
	// 			next(err);
	// 		});
			
	// 	});
		
	// });

	// Load the current nanodegree filter
	view.on('init', function(next) {
		
		if (req.params.nanodegree) {
			keystone.list('Nanodegree').model.findOne({ key: locals.filters.nanodegree }).exec(function(err, result) {
				locals.data.nanodegree = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the teams
	view.on('render', function(next) {

		var q = keystone.list('Team').paginate({
                page: req.query.page || 1,
                perPage: 8,
                maxPages: 10
            })
            .sort('-createdAt')
            .populate('members leaders group');

        if (locals.data.nanodegree) {
            q.where('group').in([locals.data.nanodegree]);
        }

        var sort = locals.current.sort;

        q.sort(sort);

        q.exec(function(err, results) {
            locals.data.pagination = results;
            locals.data.teams = locals.data.pagination.results;
            next(err);
        });
    });

	view.render('site/teams');
}
