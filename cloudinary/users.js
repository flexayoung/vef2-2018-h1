const bcrypt = require('bcrypt');
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

async function comparePasswords(hash, password) {
  const result = await bcrypt.compare(hash, password);

  return result;
}

async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser(username, password, name) {
  const hashedPassword = await bcrypt.hash(password, 11);

  const q = 'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [username, hashedPassword, name]);

  return {
    id: result.rows[0].id,
    username: result.rows[0].username,
    name: result.rows[0].name,
    image: result.rows[0].url,
  };
}

async function getAllUsers(offset, limit) {
  const q = 'SELECT id, username, name, url FROM users ORDER BY id OFFSET $1 LIMIT $2';
  const result = await query(q, [offset, limit]);
  return result.rows;
}

async function updateUser(id, name, password) {
  const q = 'UPDATE users SET name = $1, password = $2 WHERE id = $3';
  const result = await query(q, [name, password, id]);

  return result.rows[0];
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  getAllUsers,
  updateUser,
};
