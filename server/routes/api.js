const express = require('express');
const router = express.Router();
var appDB = require('../db');
var auth = require('../auth');
const config = require('../config');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');

router.post('/token', (req, res) => {
  if(req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
    appDB.connect().then(function(db) {
      return db.collection('users').findOne({ username : username });
    })
    .then(function(user) {
      if(user && passwordHash.verify(password, user.password)) {
        var payload = {
          id: user._id
        };
        var token = jwt.encode(payload, config.jwtSecret);
        res.json({ token : token });
      } else {
        res.status(401).json({ msg : 'User not found.' }).end();
      }
    })
    .catch(function(err) {
      res.status(500).end();
    });
  } else {
    res.status(401).end();
  }
});

router.get('/secret', auth.authenticate(), (req, res) => {
  res.status(200).end();
});

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

module.exports = router;
