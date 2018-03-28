var express = require('express');
var router = express.Router();

router.get('/profile', ensureAuthenticated, function(req, res) {
   res.render('profile')
  });

// router.get('/profile', (req, res) => res.render('profile'));

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		next(null, true)
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

module.exports = router;
