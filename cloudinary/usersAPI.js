const express = require('express');
const users = require('./users');


// const {
//   upload,
// } = require('./cloudinary');

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

async function fnGetUsers(req, res) {
  const userList = await users.getAllUsers();
  res.status(200).json(userList);
}

router.route('/')
  .get(catchErrors(fnGetUsers));

module.exports = router;
