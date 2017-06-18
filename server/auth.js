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

var paramsQuery = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token')
}

function dbAuth(payload, done) {
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
}

var strategy = new Strategy(params, dbAuth);
var queryStrategy = new Strategy(paramsQuery, dbAuth);
passport.use('jwtHeader', strategy);
passport.use('jwtQuery', queryStrategy);

module.exports = {
  initialize: function() {
    return passport.initialize();
  },
  authenticate: function() {
    return passport.authenticate('jwtHeader', { session : false });
  },
  authenticateQuery: function() {
    return passport.authenticate('jwtQuery', { session : false });
  }
};
