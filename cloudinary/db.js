const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost/postgres';

async function saveToDb(data) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO books(title, isbn13, author, descr, category) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [data.title, data.isbn13, data.author, data.descr, data.category];

  try {
    const row = await client.query(query, values);
    return row;
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function fetchData() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM books');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting form data');
    throw err;
  } finally {
    await client.end();
  }
}

async function runQuery(query) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(query);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function select(search = '') {
  const client = new Client({
    connectionString,
  });
  await client.connect();
  try {
    const q = `
      SELECT * FROM books
      WHERE
        to_tsvector('english', title) @@ to_tsquery('english', $1)
        OR
        to_tsvector('english', descr) @@ to_tsquery('english', $1)
    `;
    const res = await client.query(q, [search]);
    return res.rows;
    
  } catch (e) {
    console.error('Error selecting', e);
  }

  await client.end();
}

module.exports = {
  saveToDb,
  fetchData,
  runQuery,
  select,
};
