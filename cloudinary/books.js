const express = require('express');
const db = require('./db.js');
const xss = require('xss');

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

async function create({
  title, isbn13, author, descr, category,
} = {}) {
  const data = {
    title: xss(title),
    isbn13: xss(isbn13),
    author: xss(author),
    descr: xss(descr),
    category: xss(category),
  };

  const query = await db.saveToDb(data);
  return query;
}

async function update(id, {
  title, isbn13, author, descr, category,
} = {}) {
  const data = {
    title: xss(title),
    isbn13: xss(isbn13),
    author: xss(author),
    descr: xss(descr),
    category: xss(category),
  };
  const query = await db.runQuery(`UPDATE notes
  SET category = '${data.category}', author = '${data.author}', isbn13 = '${data.isbn13}', title = '${data.title}', descr = '${data.descr}'
  WHERE id = ${id} RETURNING *`);
  return query;
}

async function readAll() {
  let query = null;
  try {
    query = await db.fetchData();
    return query;
  } catch (err) { console.error(err); }
  return query;
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  /* todo útfæra */
  let query = null;
  try {
    query = await db.runQuery(`SELECT * FROM books WHERE id = ${id}`);
    return query;
  } catch (err) { console.error(err); }
  return query;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const query = await db.runQuery(`WITH deleted AS 
  (DELETE FROM books WHERE id = ${id} RETURNING *) 
  SELECT count(*) FROM deleted`);
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

