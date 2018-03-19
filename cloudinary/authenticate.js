const bcrypt = require('bcrypt');

exports.comparePasswords = (hash, user) =>
  bcrypt.compare(hash, user.password)
    .then((res) => {
      if (res) {
        return user;
      }
      return false;
    });

exports.findByUsername = username => new Promise((resolve) => {
  const found = records.find(u => u.username === username);
  if (found) {
    return resolve(found);
  }
  return resolve(null);
});

exports.findById = id => new Promise((resolve) => {
  const found = records.find(u => u.id === id);

  if (found) {
    return resolve(found);
  }

  return resolve(null);
});
