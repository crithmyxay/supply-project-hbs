const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../auth').ensureAuthenticated;

const User = require('../models/user')

const app = express();

router.post('/update', ensureAuthenticated, (req, res) => {
  User.findOne({
    where: {
      id: req.user
    }
  }).then(data => {
      data.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        number: req.body.number
      }).then(updatedResult => {
      res.render('profile', {
        firstname: updatedResult.firstname,
        lastname: updatedResult.lastname,
        number: updatedResult.number
      });
    })
  })
})

module.exports = router;
