const express = require('express');
const { upload } = require('./cloudinary')

const router = express.Router();

// app.get('/', (req, res) => {
//   res.send(`
//     <form method="post" action="/upload" enctype="multipart/form-data"n>
//       <input type="file" name="image" />
//       <button>Senda</button>
//     </form>
//   `);
// });
// app.post('/upload', uploads.single('image'), upload);

router.route('/')
  //.get(catchErrors(fnReadAll));

router.route('/:id')
  //.get(catchErrors(fnReadOne));

router.route('/:id/read')
  //.get(catchErrors(fnReadOne));

router.route('/me')
  //.get(catchErrors(fnReadOne))
  //.patch(catchErrors(fnReadOne));

router.route('/me/read')
  //.get(catchErrors(fnReadOne))
  //.post(catchErrors(fnReadOne));

router.route('/me/read/:id')
  //.get(catchErrors(fnReadOne))
  //.post(catchErrors(fnReadOne));

router.route('/me/profile')
  //.post(catchErrors(fnReadOne));

module.exports = router;
