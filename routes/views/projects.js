var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'projects';
	locals.page.title = 'Browse Projects - uHub';
	locals.filters = {
		nanodegree: req.params.nanodegree
	};
	locals.data = {
		projects: [],
		nanodegrees: [],
		categories: []
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('Nanodegree').model.find().sort('title').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.nanodegrees = results;
			
			// Load the counts for each category
			async.each(locals.data.nanodegrees, function(nanodegree, next) {
				
				keystone.list('Project').model.count().where('nanodegree').in([nanodegree.id]).exec(function(err, count) {
					nanodegree.projectCount = count;

					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current nanodegree filter
	view.on('init', function(next) {
		
		if (req.params.nanodegree) {
			keystone.list('Nanodegree').model.findOne({ key: locals.filters.nanodegree }).exec(function(err, result) {
				locals.data.nanodegrees = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the projects
	view.on('init', function(next) {

		
		var q = keystone.list('Project').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10
		})
		.where('state', 'published')
		.sort('-createdAt')
		.populate('projects nanodegree');
		
		
		if (locals.data.nanodegree) {
			q.where('nanodegrees').in([locals.data.nanodegree]);
		}

		q.exec(function(err, projects) {
			if (err) res.err(err);
			locals.data.projects = projects;
			next(err);
		});
	});
	
	// Render the view
	view.render('site/projects');
	
}


