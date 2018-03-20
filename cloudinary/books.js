const express = require('express');
const db = require('./db.js');

const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const validation = [
  check('title')
    .isLength({ min: 1 })
    .withMessage('Title should not be empty'),

  check('isbn13')
    .isLength({ min: 13 })
    .withMessage('ISBN should be at minimum 13'),

  check('descr')
    .custom(e => typeof (e) === 'string')
    .withMessage('Text must be a string'),

  sanitize('title').trim(),
];

const router = express.Router();

async function readAll() {
  /* todo útfæra */
  let query = null;
  try {
    query = await db.fetchData();
    return query;
  } catch (err) { console.error(err); }
  return query;
}

module.exports = {
  validation,
  create,
  readAll,
  readOne,
  update,
  del,
};

module.exports = router;
