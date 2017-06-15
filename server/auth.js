var passport = require('passport');
var passportJWT = require('passport-jwt');
var appDB = require('./db');
var config = require('./config');
var ObjectID = require('mongodb').ObjectID;
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

var strategy = new Strategy(params, function(payload, done) {
  appDB.connect().then(function(db) {
    return db.collection('users').findOne({ _id : new ObjectID(payload.id) });
  })
  .then(function(user) {
    if (user) {
        return done(null, {
            id: user._id
        });
    } else {
        return done(new Error('User not found'), null);
    }
  })
  .catch(function() {
    return done(new Error('Error connecting to DB'), null);
  });
});
passport.use(strategy);

module.exports = {
  initialize: function() {
    return passport.initialize();
  },
  authenticate: function() {
    return passport.authenticate('jwt', { session : false });
  }
};
