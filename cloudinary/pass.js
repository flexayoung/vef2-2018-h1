require('dotenv').config();

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const users = require('./users');

const {
  JWT_SECRET: jwtSecret,
} = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await users.findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));
