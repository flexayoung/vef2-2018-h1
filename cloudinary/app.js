require('dotenv').config();
// const cloudinary = require('cloudinary');
const express = require('express');
const usersAPI = require('./usersAPI');
// const users = require('./users');
const booksAPI = require('./booksAPI');
const categories = require('./categories');
// const multer = require('multer');
// const uploads = multer({ dest: './temp' });
const authorise = require('./authorise');
const passport = require('passport');
require('./pass');

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

const app = express();

app.use(express.json());

app.use(passport.initialize());

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
}

app.use('/', authorise.router);
app.use('/books', booksAPI);
app.use('/categories', categories);
app.use('/users', requireAuthentication, usersAPI);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  if (host) {
    console.info(`Server running at http://${host}:${port}/`);
  }
});
