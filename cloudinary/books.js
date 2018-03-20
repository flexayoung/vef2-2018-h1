const express = require('express');

const router = express.Router();

router.route('/');
// .get(catchErrors(fnReadAll))
// .post(catchErrors(function..)

router.route('/?search=query');
// .get(catchErrors(fnReadOne))

router.route('/:id');
// .get(catchErrors(fnReadOne))

module.exports = router;
