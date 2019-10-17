'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

//bodyParser() allows form data to be available in req.body. The middleware to handle
//url encoded data is returned by this bodyParser method.
//Adapted from: https://www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded({ extended: false }));


//bodyParser.json() returns middleware that only parses json. This parser
//accepts any Unicode encoding of the body. A new body object containing the
//parsed data is populated on the request object after the middleware (i.e. req.body).
//Adapted from: https://www.npmjs.com/package/body-parser.
app.use(bodyParser.json())

//Import folders with the routes for '/api/users' and '/api/courses'
const userRoutes = require('./routes/users.js');
const courseRoutes = require('./routes/courses.js')

//Import database, so I can test my connection to my database and sync my data.
const db = require('./models');
const sequelize = require('./models').sequelize;

// Test the DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// setup morgan which gives us http request logging
app.use(morgan('dev'));
app.use(cors());

// TODO setup your api routes here
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', courseRoutes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
//sync our database with our app.
const server = app.listen(app.get('port'), () => {
  db.sequelize.sync();
  console.log(`Express server is listening on port ${server.address().port}`);
});
