
async function upload(req, res, next) {
  const { file: { path } = {} } = req;
  console.log(req.file)
  if (!path) {
    return res.send('gat ekki lesið mynd');
  }

  let upload = null;

  try {
    upload = await cloudinary.v2.uploader.upload(path);
  } catch (error) {
    console.error('Unable to upload file to cloudinary:', path);
    return next(error);
  }

  const { secure_url } = upload;

  res.send(`<img src="${secure_url}">`);
}

module.exports = {
  upload,
};
