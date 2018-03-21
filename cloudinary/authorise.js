require('dotenv').config();

const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');
const { ExtractJwt } = require('passport-jwt');

const users = require('./users');

const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = '2 days',
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function validateUser(username, password, name) {
  const errors = [];
  if (typeof username !== 'string' || username.length < 3) {
    errors.push({ field: 'username', message: 'Username is required and must be at least three letters' });
  }

  if (username) {
    const user = await users.findByUsername(username);
    if (user) {
      errors.push({ field: 'username', message: 'Username is already registered' });
    }
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least six characters' });
  }

  if (typeof name !== 'string' || name.length < 2) {
    errors.push({ field: 'name', message: 'Name must not be empty and at least 2 characters ' });
  }

  return errors;
}


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await users.findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }
  const passwordIsCorrect = await users.comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token, expiresIn: tokenOptions.expiresIn });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

router.post('/register', async (req, res) => {
  const {
    username = '',
    password = '',
    name = '',
  } = req.body;

  const errors = { errors: await validateUser(username, password, name) };

  if (errors.errors.length !== 0) {
    return res.status(400).json(errors);
  }
  await users.createUser(username, password, name)
    .then(data => res.status(200).json(data));
});

module.exports = { router, validateUser };
