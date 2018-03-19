require('dotenv').config();

const fs = require('fs');
const util = require('util');
const path = require('path');

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const readFileAsync = util.promisify(fs.readFile);

const schemaFile = './schema.sql';

async function query(q) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(q);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function create() {
  const data = await readFileAsync(schemaFile);

  await query(data.toString('utf-8'));

  console.info('Schema created');
}

async function addData() {
  const filePath = path.join(__dirname, '..', 'data', 'books.csv');
  await query(`
    CREATE TEMPORARY TABLE t
    (title varchar, author varchar, description varchar,
    isbn10 varchar, isbn13 text, published varchar,
    pagecount integer, language varchar, category varchar);

    COPY t (title, author, description, isbn10, isbn13, published, pagecount, language, category)
    FROM '${filePath}'
    (FORMAT csv, HEADER, DELIMITER ',', NULL 'NULL');

    INSERT INTO categories (name)
    SELECT DISTINCT category
    FROM t;

    INSERT INTO books (title, isbn13, author, descr, category)
    SELECT title, isbn13, author, description, category
    FROM t;`);

  console.info('Schema updated');
}

create()
  .then(() => addData())
  .catch((err) => {
    console.error('Error creating schema', err);
  });
