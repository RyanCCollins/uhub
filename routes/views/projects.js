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
	
	locals.current = {
		sort: '-updateAt'
	};

	locals.data = {
		pagination: [],
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
	
		// Up vote the post
	view.on('post', { action: 'upvote-project' }, function(next) {

		var newUpVote = new ProjectRating.model();

		var ratedBefore = newUpVote.find({createdBy: req.user, project : req.project}).count();

		if (!ratedBefore && user) {

			newUpVote.set({
				project: req.project,
				rating: 1
			});
			newUpVote._req_user = req.user;
			newUpVote.save();
		}

	});

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
	
	// Load the projects
	view.on('render', function(next) {
	
		var q = keystone.list('Project').paginate({
                page: req.query.page || 1,
                perPage: 8,
                maxPages: 10
            })
            .where('state', 'published')
            .sort('-publishedDate')
            .populate('nanodegrees author projects');

        if (locals.data.nanodegree) {
            q.where('nanodegree').in([locals.data.nanodegree]);
        }

        var sort = locals.current.sort;

        q.sort(sort);

        q.exec(function(err, results) {
            locals.data.pagination = results;
            locals.data.projects = locals.data.pagination.results;
            next(err);
        });
    });

	// Render the view
	view.render('site/projects');
	
}


