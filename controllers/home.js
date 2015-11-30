/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.landingPage = function(req, res) {
	res.render('landing-page', {
		title: 'Welcome to uHub'
	});
};