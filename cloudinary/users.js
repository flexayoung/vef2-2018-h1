const bcrypt = require('bcrypt');
const { Client } = require('pg');
const users = require('./users');

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

async function getAllUsers() {
  const results = await query('SELECT username, name FROM users');

  return { results };
}

async function validateUser(username, password, name) {
  const errors = [];
  if (typeof username !== 'string' || username.length < 3) {
    errors.push({ field: 'username', message: 'Username is required and must be at least three letters' });
  }

  const user = await findByUsername(username);

  if (user) {
    errors.push({ field: 'username', message: 'Username is already registered' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least six characters' });
  }

  if (typeof name !== 'string' || name.length < 2) {
    errors.push({ field: 'name', message: 'Name must not be empty and at least 2 characters ' });
  }

  return errors;
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  validateUser,
};
