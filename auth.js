const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const User = require('./models/user');

const setupAuth = (app) => {

  app.use(cookieParser());

  app.use(session({
    secret: 'whatever',
    resave: true,
    saveUninitialized: true
  }));

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


  passport.serializeUser(function(user, done) {
    console.log('we are serializing');
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('we are deserializing');
    done(null, id);
  });

  app.use(passport.initialize());

  app.use(passport.session());

  app.get('/login', 
  passport.authenticate('local', {successRedirect:'/profile', 
                                  failureRedirect:'/'})
                                  // failureFlash: true}),
                                  // (req, res) => {
                                  //   console.log('user is logged in');
                                  // }
                                );

  app.get('/logout', function(req, res, next) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
  });

  app.get('/profile', ensureAuthenticated, (req, res) => {
    User.findOne({
      where: {
        id: req.user
      }
    }).then(data => {
      res.render('profile', {
        firstname: data.firstname,
        lastname: data.lastname,
        number: data.number
      });
    });
  });

}

const ensureAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }

  console.log('clearly, they are not authenticated');
  res.redirect('/');
}


module.exports = setupAuth;

module.exports.ensureAuthenticated = ensureAuthenticated;