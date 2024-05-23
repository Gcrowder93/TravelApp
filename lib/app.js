const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  require('cors')({
    origin: ['http://localhost:7891', 'https://lets-go-final.netlify.app'],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/github', require('./controllers/github'));

// All of these routes should be protected & authorized
app.use('/api/v1/trips', require('./controllers/trips'));
app.use('/api/v1/flights', require('./controllers/flights'));
app.use('/api/v1/yelp', require('./controllers/yelp'));
app.use('/api/v1/lodging', require('./controllers/lodging'));
app.use('/api/v1/guests', require('./controllers/guests'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
