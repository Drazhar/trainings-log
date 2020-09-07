const express = require('express');
const password = require('./api_helper/password');
const { isValidEmail } = require('./api_helper/emailValidation');
const router = express.Router();

router.post('/addUser', async (req, res) => {
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  const email = req.body.email.toLowerCase();

  if (!isValidEmail(email)) {
    res.status(400).send({ error: 'invalid email' });
    return;
  }

  const passCheck = password.isValid(req.body.password);
  if (passCheck !== true) {
    res.status(400).send({ error: passCheck });
    return;
  }

  const userPassword = await password.hashPassword(req.body.password);

  req.db.query(
    `INSERT INTO user VALUES('${email}', '${userPassword}', '${currentDate}')`,
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

module.exports = router;
