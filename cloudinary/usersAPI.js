const express = require('express');
const {
  upload,
} = require('./cloudinary');
const users = require('./users');


const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function ensureLoggedIn(req, res, next) {
  // if (req.isAuthenticated()) {
  //   return next();
  // }
  //
  // return res.redirect('/login');
}

async function validateUser(username, password, name) {
  const errors = [];
  if (typeof username !== 'string' || username.length < 3) {
    errors.push({ "field": "username", "message": "Username is required and must be at least three letters" });
  }

  const user = await users.findByUsername(username);

  if (user) {
    errors.push({ "field": "username", "message": "Username is already registered" });
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.push({ "field": "password", "message":  "Password must be at least six characters" });
  }

  if (typeof name !== 'string' || name.length < 2) {
    errors.push({ "field": "name", "message":  "Name must not be empty and at least 2 characters " });
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

// router.route('/me/profile')
//   //.post(catchErrors(fnReadOne));




module.exports = router;
