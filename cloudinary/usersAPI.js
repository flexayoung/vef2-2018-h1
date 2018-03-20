const express = require('express');
const users = require('./users');


// const {
//   upload,
// } = require('./cloudinary');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
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
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const rows = await users.getAllUsers(offset, limit);

  res.status(200).json({ limit, offset, items: rows });
}

router.get('/', catchErrors(fnGetUsers));
router.get('/', catchErrors(fnGetUsers));

module.exports = router;
