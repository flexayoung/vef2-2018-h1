const express = require('express');
const users = require('./users');

// const {
//   upload,
// } = require('./cloudinary');

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

// app.get('/', (req, res) => {
//   res.send(`
//     <form method="post" action="/upload" enctype="multipart/form-data"n>
//       <input type="file" name="image" />
//       <button>Senda</button>
//     </form>
//   `);
// });
// app.post('/upload', uploads.single('image'), upload);
//
// async function fnGetUsers(req, res) {
//
// }

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

  if (typeof name === 'undefined' && typeof password === 'undefined') return res.status(400).json({ error: 'Nothing to patch' });
  const errors = { errors: await validateUser(password, name) };

  if (errors.errors.length !== 0) {
    return res.status(400).json(errors);
  }

  const row = await users.updateUser(user.id, password, name);

  return res.status(200).json({ row });
}

router.get('/', catchErrors(fnGetAllUsers));
router.route('/me')
  .get(catchErrors(fnGetCurrentUser))
  .patch(catchErrors(fnUpdateUser));
router.get('/:id', catchErrors(fnGetUser));

module.exports = router;
