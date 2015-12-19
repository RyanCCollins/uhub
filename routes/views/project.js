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
		project: {},
		featureImage: {},
		imageGallery: {},
		canEdit: false
	}

	view.on('init', function(next) {

		Project.model.findOne()
			.where('slug', locals.filters.project)
			.populate('author')
			.exec(function(err, project) {
				
				if (err) return res.err(err);
				if (!project) return res.notfound('Project not found');
				
				// Allow admins or the author to see draft projects
				if (project.state == 'published' || (req.user && req.user.isAdmin) || (req.user && project.author && (req.user.id == project.author.id))) {
					locals.project = project;
					locals.project.populateRelated('comments[author]', next);
					locals.page.title = project.title + ' - Projects - uHub';
				} else {
					return res.notfound('Project not found');
				}
				
			});
	});
	

	
	// Render the view
	view.render('site/project');
}