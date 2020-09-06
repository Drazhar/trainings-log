const express = require('express');
const router = express.Router();

router.get('/addUser', (req, res) => {
  req.db.query('SELECT * FROM user', (err, result) => {
    if (err) res.status(500).send(err);
    res.status(200).send(result);
  });
});

module.exports = router;
