// Load .env for development environments
require('dotenv').load();

// Initialise New Relic if an app name and license key exists
if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
	require('newrelic');
}

/**
 * Application Initialisation
 */

var keystone = require('keystone');
var pkg = require('./package.json');
var port = process.env.PORT || 8080;
var IP = process.env.IP || '192.168.33.10';
var secrets = require('./lib/auth/secrets');

keystone.init({

	'name': 'uHub',
	'brand': 'uHub',
	'back': '/me',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',
	'view cache': false,

	'emails': 'templates/emails',

	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,

	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': secrets.sessionSecret,

	'mandrill api key': secrets.mandrill.password,
	'cloudinary config': secrets.cloudinary.uri,
	
	'google api key': secrets.google.clientID,
	'google server api key': secrets.google.clientSecret,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,

	'basedir': __dirname

});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.set('locals', {
	_: require('underscore'),
	moment: require('moment'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('email locals', {
	utils: keystone.utils,
	host: (function() {
		if (keystone.get('env') === 'development') return IP;
		if (keystone.get('env') === 'staging') return 'http://uhub-beta.herokuapp.com';
		if (keystone.get('env') === 'production') return 'http://www.uhub.io';
		return (keystone.get('host') || IP) + (keystone.get('port') || port);
	})()
});

keystone.set('nav', {
	'members': ['users', 'organizations', 'teams'],
	'projects': ['projects', 'project-categories', 'project-comments', 'project-ratings'],
	'chatrooms': ['chat-rooms'],
	'meetups': ['meetups', 'talks', 'rsvps'],
	'posts': ['posts', 'post-categories', 'post-comments'],
	'links': ['links', 'link-tags', 'link-comments']
});

keystone.set('nav-profile-dropdown', {
	'My Profile': '/me',
	'My Projects': '/me/projects',
	'Sign Out' : '/signout'
});

keystone.set('cloudinary config', {
	'cloudinary config': secrets.cloudinary.uri,
		'cloudinary prefix': 'uhub',
		'cloudinary secure': true

});


keystone.set('jwtTokenSecret', secrets.tokenSecret); // put in something hard to guess

// Start Keystone to connect to your database and initialise the web server
keystone.start(
{
	onHttpServerCreated: function() 
	{
// Instantiate an express.io app object, tack it on to keystone
		keystone.socketioapp = require('express.io')();
// The 'server' property is used internally by express.io as the express http or https object, so copy it from keystone
		keystone.socketioapp.server=keystone.httpServer;
// Since the http(s) object has already been created by keystone just before this callback, we call express.io's socket.io instantiator rather than creating another server with: keystone.socketioapp.http().io(); This allows socket.io to use the same port as keystone.
		keystone.socketioapp.io();
		
		var socketio = keystone.socketioapp.io;
		keystone.set('socketio', socketio);

		var port = keystone.get('port');
// 'listen' will share the port with keystone
		keystone.socketioapp.server.listen(port?port:3000);
		
		socketio.set('heartbeat timeout', 20);
		socketio.set('heartbeat interval', 10);
		socketio.enable('heartbeats');
		
		socketio.on('connection', function(socket) {

			socket.on('connected', function(token) {
				user = checkToken(token);
	  			if (typeof user == 'object') {
	  				socket.user = user;
				}

			});
		});
	}
});