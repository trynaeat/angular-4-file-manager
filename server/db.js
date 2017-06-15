var dbUrl = 'mongodb://localhost:27017/mean-app';
var MongoClient = require('mongodb').MongoClient;
var db = null;

module.exports = {};
/**
 * Connect to MongoDB
 */
module.exports.connect = function() {
  return new Promise(function(resolve, reject) {
    if(db) {
      resolve(db);
    } else {
      MongoClient.connect(dbUrl).then(function(result) {
        console.log('Connected to DB.');
        db = result;
        resolve(db);
      })
      .catch(function(err) {
        reject(err);
      });
    }
  });
}
