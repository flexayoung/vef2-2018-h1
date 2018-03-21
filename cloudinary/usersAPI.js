
const express = require('express');
const users = require('./users');
const books = require('./books');
const userbooks = require('./userbooks');
const { upload } = require('./cloudinary');

const multer = require('multer');

const uploads = multer({ dest: './temp' });

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function validateUser(password, name) {
  const errors = [];

  if (typeof password !== 'undefined' && (typeof password !== 'string' || password.length < 6)) {
    errors.push({ field: 'password', message: 'Password must be at least six characters' });
  }

  if (typeof name !== 'undefined' && (typeof name !== 'string' || name.length < 2)) {
    errors.push({ field: 'name', message: 'Name must not be empty and at least 2 characters ' });
  }

  return errors;
}


async function validateBook(bookId, rating) {
  const errors = [];
  if (typeof bookId !== 'number') {
    errors.push({ field: 'bookId', message: 'Book is required and must be a number' });
  } else if (!await books.readOne(bookId)) {
    errors.push({ field: 'bookId', message: `Book ${bookId} does not exist` });
  }

  if (typeof rating !== 'number') {
    errors.push({ field: 'rating', message: 'Rating is required and must be a number' });
  } else if (rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Rating must be the number 1, 2, 3, 4, or 5' });
  }

  return errors;
}

async function fnGetAllUsers(req, res) {
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const rows = await users.getAllUsers(offset, limit);

  res.status(200).json({ limit, offset, items: rows });
}

async function fnGetUser(req, res) {
  if (!req.params.id) return res.status(400).json({ error: 'User not found' });
  const id = Number(req.params.id);
  const row = await users.getUserFromId(id);

  return res.status(200).json({ user: row });
}

async function fnGetCurrentUser(req, res) {
  const { user } = req;
  return res.status(200).json({
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.url,
  });
}

async function fnUpdateUser(req, res) {
  const { user } = req;
  const {
    name,
    password,
  } = req.body;

  if (typeof name === 'undefined' && typeof password === 'undefined') {
    return res.status(400).json({ error: 'Nothing to patch' });
  }

  const errors = { errors: await validateUser(password, name) };

  if (errors.errors.length !== 0) {
    return res.status(400).json(errors);
  }

  const row = await users.updateUser(user.id, password, name);

  return res.status(200).json({ row });
}

async function fnUpdateUserImage(req, res) {
  const url = await upload(req, res);
  res.status(200).json(url);
}

async function fnReadBook(req, res) {
  let readBook;
  const {
    bookId,
    rating = '',
    review,
  } = req.body;

  const userId = req.user.id;

  const errors = await validateBook(bookId, rating);
  if (errors.length !== 0) return res.status(400).json({ errors });

  const isBookRegistered = await userbooks.isBookReviewed(userId, bookId);
  if (isBookRegistered) {
    readBook = await userbooks.updateUserReview(userId, bookId, rating, review);
  } else if (await books.readOne(bookId) && await users.findById(userId)) {
    readBook = await userbooks.readBook(userId, bookId, rating, review);
  }
  return res.status(200).json({ readBook });
}

async function fnGetAllReadBooks(req, res) {
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const { user } = req;
  const readBooks = await userbooks.getAllReadBooks(user.id, offset, limit);
  res.status(200).json({ offset, limit, items: readBooks });
}

async function fnGetBooksById(req, res) {
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const userId = req.params.id;
  const readBooks = await userbooks.getAllReadBooks(userId, offset, limit);
  res.status(200).json({ offset, limit, items: readBooks });
}
async function fnDeleteUserReview(req, res) {
  const bookId = req.params.id;
  const { user } = req;

  const isBookRegistered = await userbooks.isBookReviewed(user.id, bookId);
  if (isBookRegistered) {
    await userbooks.deleteReview(user.id, bookId);
    res.status(200).json({ msg: 'Book review successfully deleted' });
  } else {
    res.status(400).json({ error: 'Book review not found' });
  }
}

router.get('/', catchErrors(fnGetAllUsers));

router.route('/me')
  .get(catchErrors(fnGetCurrentUser))
  .patch(catchErrors(fnUpdateUser));

router.post('/me/profile', uploads.single('image'), catchErrors(fnUpdateUserImage));

router.route('/me/read')
  .get(catchErrors(fnGetAllReadBooks))
  .post(catchErrors(fnReadBook));

router.delete('/me/read/:id', catchErrors(fnDeleteUserReview));

router.get('/:id', catchErrors(fnGetUser));
router.get('/:id/read', catchErrors(fnGetBooksById));


module.exports = router;
