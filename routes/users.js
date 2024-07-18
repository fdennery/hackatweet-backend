var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); // Ajout de bcrypt pour le hachage des mots de passe
const uid2 = require('uid2');
require('../models/connection');
const User = require('../models/users');

/* GET users listing. */
router.get('/', (req, res) => {
  res.json({ result: true });
});

// Route test 
router.post('/createTest', (req, res) => {
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
      res.json({ result: false, error: 'User already exists' });
    }
  });
});



















// CREER nouvelles routes ICI 
function checkBody(body, keys) {
  let isValid = true;
  for (const field of keys) {
    if (!body[field] || body[field] === '') {
      isValid = false;
    }
  }
  return isValid;
}

router.post("/signup", (req, res) => {
  // Check if signup data is valid 
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if user is already registered
  User.findOne({ username: req.body.username })
    .then(data => {
      if (data === null) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.json({ result: false, error: "Password hashing failed" });
            return;
          }

          // User is not registered 
          const newUser = new User({
            firstname: req.body.firstname,
            username: req.body.username,
            password: hash,
            token: uid2(32),
          });

          newUser.save().then(() => {
            res.json({ result: true });
          });
        });
      } else {
        res.json({ result: false, error: "User already exists" });
      }
    });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username, password: req.body.password })
    .then(data => {
      if (data) {
        res.json({ result: true });
      } else {
        // User is already registered 
        res.json({ result: false, error: "User not found" });
      }
    });
});

module.exports = router;