var keystone = require('keystone'),
	_ = require('underscore'),
	moment = require('moment');

// var Meetup = keystone.list('Meetup'),
// 	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'chat';
	locals.page.title = 'Chat - uHub';
	locals.chat = {
		name : 'Main'
	} 
	
	
	view.render('gitter/main');
	
}

