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
	
	locals.data = {
		project: [],
		canEdit: false
	}

	view.on('init', function(next) {

		Project.model.findOne()
			.where('slug', locals.filters.project)
			.populate('featureImage nanodegree categories gallery project author buildInformation')
			.exec(function(err, project) {
				
				if (err) return res.err(err);
				if (!project) return res.notfound('Project not found');
				
				// Allow admins or the author to see draft projects
				if (project.state == 'published' || (req.user && req.user.isAdmin) || (req.user && project.author && (req.user.id == project.author.id))) {
					locals.project = project;
					locals.project.populateRelated('comments[author]', next);
					locals.page.title = project.title + ' - Student Projects - uHub';

						//Allow editing if user or admin
						if (req.user.id == project.author.id || req.user.isAdmin) {
							locals.data.canEdit = true;
						}
				} else {
					console.log('Not a valid project');
					return res.notfound('Project not found');
				}
				
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
		
		// updater.process(req.body, {
		// 	flashErrors: true,
		// 	logErrors: true,
		// 	fields: 'title, image, content.extended'
		// }, function(err) {
		// 	if (err) {
		// 		locals.validationErrors = err.errors;
		// 	} else {
		// 		newPost.notifyAdmins();
		// 		req.flash('success', 'Your post has been added' + ((newPost.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
		// 		return res.redirect('/blog/post/' + newPost.slug);
		// 	}
		// 	next();
		// });

	});
	
	view.on('post', { action: 'create-comment' }, function(next) {

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