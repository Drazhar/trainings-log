const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

function isValid(password) {
  if (password.length < 6) {
    return false;
  } else if (password.length > 72) {
    return false;
  }
  return true;
}

module.exports = { hashPassword, isValid };
