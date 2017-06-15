// Get dependencies
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');
// Load jwt authentication
const auth = require('./server/auth');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(auth.initialize());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = https.createServer({
  key: fs.readFileSync('./server/ssl/server.key'),
  cert: fs.readFileSync('./server/ssl/server.crt'),
  ca: fs.readFileSync('./server/ssl/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
}, app);


/**
* Listen on provided port, on all network interfaces.
*/
server.listen(port, function(err, result) {
  console.log('Server running on localhost:' + port);
});
