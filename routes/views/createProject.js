var keystone = require('keystone'),
	Project = keystone.list('Project');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'createproject';
	locals.page.title = 'Submit a project - uHub';
	
	view.on('project', { action: 'create-project' }, function(next) {

		// handle form
		var newProject = new Project.model({
				author: locals.user.id,
				publishedDate: new Date()
			}),

			updater = Project.getUpdateHandler(req, res, {
				errorMessage: 'There was an error submiting your project'
			});
		
		// automatically pubish posts by admin users
		if (locals.user.isAdmin || locals.user.canPostProjects) {
			newProject.state = 'published';
		}
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'title, image, content.extended'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				newProject.notifyAdmins();
				req.flash('success', 'Your project has been added' + ((newProject.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
				return res.redirect('/projects/project/' + newProject.slug);
			}
			next();
		});

	});
	
	view.render('site/createProject');
	
}
