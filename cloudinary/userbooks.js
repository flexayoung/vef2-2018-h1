const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function readBook(userId, bookId, score, review) {
  const q = 'INSERT INTO userbooks (userID, bookID, score, review) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await query(q, [userId, bookId, score, review]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function getAllReadBooks(userId, offset, limit) {
  const q = 'SELECT * FROM userbooks WHERE userID = $1 OFFSET $2 LIMIT $3';
  const result = await query(q, [userId, offset, limit]);

  return result.rows;
}

async function isBookReviewed(userId, bookId) {
  const q = 'SELECT * FROM userbooks WHERE userID = $1 AND bookID = $2';
  const result = await query(q, [userId, bookId]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function updateUserReview(userId, bookId, rating, review) {
  const q = 'UPDATE userbooks SET score = $3, review = $4 WHERE userID = $1 AND bookID = $2 RETURNING *';
  const result = await query(q, [userId, bookId, rating, review]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function deleteReview(userId, bookId) {
  const q = 'DELETE FROM userbooks WHERE userID = $1 AND bookID = $2';
  await query(q, [userId, bookId]);
}

module.exports = {
  readBook,
  deleteReview,
  getAllReadBooks,
  isBookReviewed,
  updateUserReview,
};
