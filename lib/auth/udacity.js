var _ = require('underscore');
var async = require('async');
var keystone = require('keystone');
var passport = require('passport');
//var passportOAuthStrategy = require('passport-oauth');
var secrets = require('./secrets');
var UdacityUser = require('udacity-api').User;
var User = keystone.list('User');

var credentials = {
	clientID: secrets.udacity.clientID || process.env.UDACITY_CLIENT_ID,
	clientSecret: secrets.udacity.clientSecret || process.env.UDACITY_CLIENT_SECRET,
	callbackURL: secrets.udacity.callbackURL || process.env.UDACITY_CALLBACK_URL,

	scope: 'profile email'
};

exports.authenticateUser = function(req, res, next) {
	// var self = this;

	// var redirect = '/auth/confirm';
	// if (req.cookies.target && req.cookies.target == 'app') redirect = '/auth/app';

	// // Begin process
	// console.log('============================================================');
	// console.log('[services.udacity] - Triggered authentication process...');
	// console.log('------------------------------------------------------------');

	// // Initalise Udacity credentials
	// var udacityStrategy = new passportOAuthStrategy(credentials, function(accessToken, refreshToken, profile, done) {
	// 	done(null, {
	// 		authorizationURL: 'https://www.udacity.com/api/session'
	// 	});
	// });

	// // Pass through authentication to passport
	// passport.use(udacityStrategy);

	// // Save user data once returning from udacity
	// if (_.has(req.query, 'cb')) {

	// 	console.log('[services.udacity] - Callback workflow detected, attempting to process data...');
	// 	console.log('------------------------------------------------------------');

	// 	passport.authenticate('udacity', { session: false }, function(err, data, info) {

	// 		if (err || !data) {
	// 			console.log("[services.udacity] - Error retrieving udacity account data - " + JSON.stringify(err));
	// 			return res.redirect('/signin');
	// 		}

	// 		console.log('[services.udacity] - Successfully retrieved udacity account data, processing...');
	// 		console.log('------------------------------------------------------------');

	// 		console.log(data);
	// 		}

	// 		req.session.auth = auth;

	// 		return res.redirect(redirect);

	// 	})(req, res, next);

	// // Perform inital authentication request to udacity
	// } else {

	// 	console.log('[services.udacity] - Authentication workflow detected, attempting to request access...');
	// 	console.log('------------------------------------------------------------');

	// 	passport.authenticate('udacity', { accessType: 'offline' })(req, res, next); // approvalPrompt: 'force'

	// }
	var me = new UdacityUser(req.body.email, req.body.password);

	me.name(function(err, data) {
    	console.log(data);
	});

};
