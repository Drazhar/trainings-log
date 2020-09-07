const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

function isValid(password) {
  if (password.length < 6) {
    return 'too short';
  } else if (password.length > 72) {
    return 'too long';
  }
  return true;
}

module.exports = { hashPassword, isValid };
