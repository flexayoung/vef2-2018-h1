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

async function deleteBook(userId, bookId) {
  const q = 'INSERT INTO userbooks (userID, bookID, score, review) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await query(q, [userId, bookId, score, review]);
}
module.exports = {
  readBook,
  deleteBook,
  getAllReadBooks,
};
