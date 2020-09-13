const express = require('express');
const password = require('./api_helper/password');
const { isValidEmail } = require('./api_helper/emailValidation');
const passport = require('passport');
const router = express.Router();

router.post(
  '/addUser',
  (req, res, next) => {
    // Input validation
    req.body.email = req.body.email.toLowerCase();
    if (!isValidEmail(req.body.email)) {
      res.status(500).send({ success: false, message: 'invalid email' });
      return;
    }
    if (!password.isValid(req.body.password)) {
      res.status(500).send({ success: false, message: 'invalid password' });
      return;
    }

    next();
  },
  (req, res, next) => {
    // Authentication
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) next(err);
      if (!user) {
        res
          .status(500)
          .send({ success: false, message: 'user already defined' });
        return;
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.status(200).send({
          success: true,
          message: 'user logged in',
          userID: user.userID,
        });
      });
    })(req, res, next);
  }
);

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) next(err);
    if (!user) {
      res.status(500).send({ success: false, message: info.message });
      return;
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).send({
        success: true,
        message: 'user logged in',
        userID: user.userID,
      });
    });
  })(req, res, next);
});

router.get('/userStatus', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ isUserAuth: true, userID: req.user.id });
  } else {
    res.status(200).send({ isUserAuth: false, userID: '' });
  }
});

router.post('/addWeight', (req, res) => {
  const userID = req.user.id;
  const weight = req.body.weight;
  const date = req.body.date;

  req.db.query(
    `INSERT INTO weight (user_id, date, weight) VALUES('${userID}', '${date}', ${weight}) ON DUPLICATE KEY UPDATE weight=VALUES(weight);`,
    (error) => {
      if (error) throw error;
      res.sendStatus(200);
    }
  );
});

router.get('/getWeight', (req, res) => {
  req.db.query(
    `SELECT date, weight FROM weight WHERE date >= '2000-09-11' AND date <= '2025-09-13' AND user_id = '${req.user.id}';`,
    (err, result) => {
      res.status(200).send(result);
    }
  );
});

module.exports = router;
