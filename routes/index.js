var express = require('express');
var router = express.Router();
const expressValidator = require('express-validator');
const User = require('../models/user')

// router.get('/profile', (req, res) => res.render('profile'));

// router.get('/profile', function(req, res) {
//   res.render('profile')
//  });

// function ensureAuthenticated(req, res, next) {
// 	if(req.isAuthenticated()){
// 		next(null, true)
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
// 		res.redirect('/');
// 	}
// }

router.get('/signup', (req, res) => {
  res.render('register');
})

router.route('/register')

  .post((req, res) => {
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let number = req.body.number;
    let email = req.body.email;
    let password = req.body.password;

    // Validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('confirmEmail', 'Emails do not match').equals(req.body.email);
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
      console.log(errors);
      res.render('register', {errors});
    } else {
      let newUser = new User({
        firstname: firstName, 
        lastname: lastName, 
        number: number,
        email: email,
        password: password
      });
      
      User.createUser(newUser, (err, user) => {
        if (err) throw err;
        console.log(user);
      })
      res.redirect('/');
    }
  })

module.exports = router;
