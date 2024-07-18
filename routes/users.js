var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
require ('../models/connection')
const User = require('../models/users')

/* GET users listing. */
router.get('/', (req, res,) => {
  res.json({result: true });
});

// * Route test 
router.post('/createTest', (req, res) => {

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: req.body.password,
        token: uid2(32),
    
      });
      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});
















// CREER nouvelles routes ICI 







module.exports = router;
