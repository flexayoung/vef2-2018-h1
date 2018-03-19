require('dotenv').config();
const cloudinary = require('cloudinary');
const express = require('express');
const multer = require('multer');

const uploads = multer({ dest: './temp' });

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
  CLOUDINARY_CLOUD,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Missing cloudinary config, uploading images will not work');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use('/', api);


function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);


app.listen(port, () => {
  if (host) {
    console.info(`Server running at http://${host}:${port}/`);
  }
});
