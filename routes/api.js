const express = require('express');
const router = express.Router();

router.post('/addUser', (req, res) => {
  req.db.query(
    `INSERT INTO user VALUES('trauthp@gmail.com', 'savePass', 'Drazhar', 178.5, '1987-09-07')`,
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
