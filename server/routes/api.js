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
var fs = require('fs');
var Promise = require('bluebird');

var deleteFile = Promise.promisify(fs.unlink);

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
  var db;
  var page = parseInt(req.query.page);
  var size = parseInt(req.query.size);
  var response = {};
  if(!page || !size || page < 1) {
    return res.status(400).end();
  }
  appDB.connect().then(function(res) {
    db = res
    return db.collection('files').find().count();
  })
  .then(function(count) {
    response.totalSize = count;
    response.lastPage = (Math.ceil(count / size) > page ? false : true);
    return db.collection('files').find({}, { _id : 1, description : 1, filename : 1 }).skip((page - 1) * size).limit(size).toArray();
  })
  .then(function(files) {
    response.data = files;
    res.json(response);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
});

router.get('/file/:id', auth.authenticateQuery(), (req, res) => {
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
    res.download(path, file.filename);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
});

router.post('/file/:id', auth.authenticate(), (req, res) => {
  var id = req.params.id ? new ObjectID(req.params.id) : null;
  if(!id) {
    return res.status(400).end();
  }
  var updateObj = {};
  var file = req.body;
  Object.keys(file).forEach(function(key) {
    if(config.file.editableFields[key]) {
      updateObj[key] = file[key];
    }
  });
  appDB.connect().then(function(db) {
    return db.collection('files').updateOne({ _id : id }, { $set : updateObj });
  })
  .then(function() {
    res.json({ status: 'success' }).status(200).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
});

router.delete('/file/:id', auth.authenticate(), (req, res) => {
  var id = req.params.id ? new ObjectID(req.params.id) : null;
  if(!id) {
    return res.status(400).end();
  }
  var db = null;
  appDB.connect().then(function(result) {
    db = result;
    return db.collection('files').findOne({ _id : id });
  })
  .then(function(file) {
    return deleteFile(file.location);
  })
  .then(function() {
    return db.collection('files').deleteOne({ _id : id });
  })
  .then(function() {
    res.json({ status: 'success' }).status(200).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
});

router.post('/file', auth.authenticate(), upload.any(), (req, res) => {
  // Only support one file at a time at the moment...
  var files = req.files;
  var file = files[0];
  appDB.connect().then(function(db) {
    return db.collection('files').insert({ filename: file.originalname, description: '', location: file.path });
  })
  .then(function() {
    res.json({ status: 'success' }).status(200).end();
  })
  .catch(function() {
    res.status(500).end();
  });
});

router.get('/secret', auth.authenticate(), (req, res) => {
  res.status(200).end();
});

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

module.exports = router;
