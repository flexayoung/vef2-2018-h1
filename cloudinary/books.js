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
  const query = await db.runQuery(`UPDATE books
  SET category = '${data.category}', author = '${data.author}', isbn13 = '${data.isbn13}', title = '${data.title}', descr = '${data.descr}'
  WHERE id = ${id} RETURNING *`);
  return query;
}

async function readAll(offset, limit) {
  let query = null;
  try {
    query = await db.runQuery(`SELECT * FROM books ORDER BY id OFFSET ${offset} LIMIT ${limit}`);
    return query;
  } catch (err) { console.error(err); }
  return query;
}

/**
 * Read a single book.
 *
 * @param {number} id - Id of book
 *
 * @returns {Promise} Promise representing the book object or null if not found
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
 * Delete a book asynchronously.
 *
 * @param {number} id - Id of book to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the book
 */
async function del(id) {
  const query = await db.runQuery(`WITH deleted AS 
  (DELETE FROM books WHERE id = ${id} RETURNING *) 
  SELECT count(*) FROM deleted`);
  return query;
}

async function select(search) {
  /* todo útfæra */
  let query = null;
  try {
    query = await db.select(search);
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
  select,
};

