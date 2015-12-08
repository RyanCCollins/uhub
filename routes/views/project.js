var keystone = require('keystone');

var Project = keystone.list('Project');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'project';
	locals.filters = {
		project: req.params.project
	};
	
	view.on('init', function(next) {

		Project.model.findOne()
			.where('slug', locals.filters.project)
			.populate('project')
			.exec(function(err, project) {
				
				if (err) return res.err(err);
				if (!project) return res.notfound('Project not found');
				
				// Allow admins or the author to see draft projects
				if (project.state == 'published' || (req.user && req.user.isAdmin) || (req.user && project.author && (req.user.id == project.author.id))) {
					locals.project = project;
					//locals.project.populateRelated('comments[author]', next);
					locals.page.title = project.title + ' - Student Projects - uHub';
				} else {
					console.log('Not a valid project');
					return res.notfound('Project not found');
				}
				
			});

	});
	
	// Load recent Projects
	view.query('data.projects',
		Project.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('1')
	);
	
	view.on('project', { action: 'create-comment' }, function(next) {

		// handle form
		var newProjectComment = new ProjectComment.model({
				project: locals.project.id,
				author: locals.user.id
			}),
			updater = newProjectComment.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your comment:'
			});
			
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'content'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment has been added successfully.');
				return res.redirect('/projects/project/' + locals.project.slug);
			}
			next();
		});

	});
	
	// Render the view
	view.render('site/project');
	
}