var secrets = require('./secrets');
var User = keystone.list('User');
var GithubAPI = require('machinepack-github');

// exports.authenticateUserGithub = function(req, res, next) {
// 	if (!req.user.github.isConfigured || !user.github.accessToken) {

// 	}
// }

GithubAPI.getCurrentUser({
	accessToken: user.github.accessToken,
}).exec({
	error: function(err){
		req.flash('error', 'Could not connect to github.  Please try again.');
	},

	success: function(result){
		console.log(result);
	},
});