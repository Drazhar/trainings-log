const express = require('express');
const password = require('./api_helper/password');
const router = express.Router();

router.post('/addUser', async (req, res) => {
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  const userPassword = await password.hashPassword(req.body.password);

  req.db.query(
    `INSERT INTO user VALUES('${req.body.email}', '${userPassword}', '${currentDate}')`,
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
