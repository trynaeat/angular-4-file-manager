const express = require('express');
const router = express.Router();
var appDB = require('../db');
var auth = require('../auth');
const config = require('../config');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
var ObjectID = require('mongodb').ObjectID;
var multer = require('multer');
var upload = multer({ dest : '/Users/jakparks/uploads/' });

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

router.get('/files', auth.authenticate(), (req, res) => {
  var page = parseInt(req.query.page);
  var size = parseInt(req.query.size);
  if(!page || !size || page < 1) {
    return res.status(400).end();
  }
  appDB.connect().then(function(db) {
    return db.collection('files').find({}, { _id : 1, description : 1, filename : 1 }).skip((page - 1) * size).limit(size).toArray();
  })
  .then(function(files) {
    res.json(files);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
});

router.get('/download/:id', auth.authenticateQuery(), (req, res) => {
  var id = req.params.id ? new ObjectID(req.params.id) : null;
  if(!id) {
    return res.status(400).end();
  }
  appDB.connect().then(function(db) {
    return db.collection('files').findOne({ _id : id });
  })
  .then(function(file) {
    if(!file) {
      return res.status(400).json({ error : 'File not found' }).end();
    }
    var path = file.location;
    res.download(path);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
});

router.post('/upload', auth.authenticate(), upload.any(), (req, res) => {
  var files = req.files;
  console.log(files);
  res.json({ status: 'success' }).status(200).end();
});

router.get('/secret', auth.authenticate(), (req, res) => {
  res.status(200).end();
});

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

module.exports = router;
