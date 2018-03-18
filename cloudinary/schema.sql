CREATE TABLE users (
  id serial primary key,
  username varchar UNIQUE,
  password character varying(255) NOT NULL,
  name varchar NOT NULL,
  url varchar
);

CREATE TABLE categories (
  id serial primary key,
  name varchar UNIQUE not null
);

CREATE TABLE books (
  id serial primary key,
  title varchar UNIQUE not null,
  isbn13 text UNIQUE check(isbn13 < 14),
  author varchar,
  descr varchar,
  category varchar REFERENCES categories(name)
);

CREATE TABLE userbooks(
  id serial primary key,
  userID serial REFERENCES users(id),
  bookID serial REFERENCES books(id),
  score integer check(score < 6 and score > 0),
  review text
);