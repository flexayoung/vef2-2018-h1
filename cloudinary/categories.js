const db = require('./db.js');
const xss = require('xss');
const express = require('express');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function createData({ category } = {}) {
  const data = {
    category: xss(category),
  };
  const query = await db.saveToDb(data);
  return query;
}

async function readAll(offset, limit) {
  let query = null;
  try {
    query = await db.runQuery(`SELECT * FROM categories ORDER BY id OFFSET ${offset} LIMIT ${limit}`);
    return query;
  } catch (err) { console.error(err); }
  return query;
}

router.get('/', async (req, res) => {
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  readAll(offset, limit)
    .then(data => res.status(200).json({ limit, offset, items: data }))
    .catch(err => console.error(err));
});

router.post('/', catchErrors(createData));

module.exports = router;
