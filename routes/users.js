const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');

const User = require('../models/user')

const app = express();

router.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Sign up rendering
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
    req.check('firstname', 'First name is required').notEmpty();
    req.check('lastname', 'Last name is required').notEmpty();
    req.check('email', 'Email is required').notEmpty();
    req.check('email', 'Email is not valid').isEmail();
    req.check('confirmEmail', 'Emails do not match').equals(req.body.email);
    req.check('password', 'Password is required').notEmpty();
    req.check('confirmPassword', 'Passwords do not match').equals(req.body.password);

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

router.route('/update')

  .put((req, res) => {
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let number = req.body.number;

    let updateUser = User({
      firstname: firstName,
      lastname: lastName,
      number: number
    })
  })

passport.use(new LocalStrategy(
  { usernameField: 'email',
    passwordField: 'password'},
    // passReqToCallback : true },
  (username, password, done) => {
    User.findOne({
        where: {
          email: username
        }
      }).then((user)=> {
        if (user) {
          User.comparePassword(password, user.password, function(err, res) {
            if (err) {throw err}
            else if(res) {
              console.log('that worked!');
              return done(null, user)
            } else {
             console.log('that did not work');
             return done(null, false)
            } 
          });
        }
        if (!user) {
          console.log('thats not an email');
          return done (null, false)
        }
      })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

successRedirect:'/profile', 
  
router.post('/login', 
  passport.authenticate('local', {successRedirect:'/profile', 
                                  failureRedirect:'http://google.com', 
                                  failureFlash: true})
                                );


router.get('/logout', (req, res, next) => {
  console.log('logging out');
  req.logout();
  res.redirect('/');
  });

module.exports = router;
