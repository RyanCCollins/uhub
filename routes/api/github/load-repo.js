var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore');

// var secrets = require('../../../lib/secrets');

// exports.getGithub = function(req, res, next) {
//   Github = require('github-api');

//   var token = _.find(req.user.tokens, { kind: 'github' });
//   var github = new Github({ token: token.accessToken });
//   var repo = github.getRepo('sahat', 'requirejs-library');
//   repo.show(function(err, repo) {
//     if (err) {
//       return next(err);
//     }
//     res.render('api/github', {
//       title: 'GitHub API',
//       repo: repo
//     });
//   });

// };