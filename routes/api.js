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
      res.status(500).send({ message: 'invalid email' });
      return;
    }
    if (!password.isValid(req.body.password)) {
      res.status(500).send({ message: 'invalid password' });
      return;
    }

    next();
  },
  (req, res, next) => {
    // Authentication
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) next(err);
      if (!user) {
        res.status(500).send({ message: 'user already defined' });
        return;
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.status(200).send({ message: 'user logged in', email: user.email });
      });
    })(req, res, next);
  }
);

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) next(err);
    if (!user) {
      res.status(500).send({ message: info.message });
      return;
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).send({ message: 'user logged in', email: user.email });
    });
  })(req, res, next);
});

module.exports = router;
