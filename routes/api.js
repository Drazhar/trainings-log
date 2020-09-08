const express = require('express');
const password = require('./api_helper/password');
const { isValidEmail } = require('./api_helper/emailValidation');
const { getTodayDate } = require('./api_helper/utilities');
const passport = require('passport');
const router = express.Router();

router.post('/addUser', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    console.log('err:', err);
    console.log('user: ', user);
    console.log('info: ', info);
  })(req, res, next);
});

// router.post('/addUser', async (req, res) => {
//   const email = req.body.email.toLowerCase();

//   if (!isValidEmail(email)) {
//     res.status(400).send({ error: 'invalid email' });
//     return;
//   }

//   const passCheck = password.isValid(req.body.password);
//   if (passCheck !== true) {
//     res.status(400).send({ error: passCheck });
//     return;
//   }

//   const userPassword = await password.hashPassword(req.body.password);

//   console.log('end');
//   res.sendStatus(200);
//   // req.db.query(
//   //   `INSERT INTO user VALUES('${email}', '${userPassword}', '${getTodayDate()}')`,
//   //   (err, result) => {
//   //     if (err) {
//   //       res.status(500).send(err);
//   //     } else {
//   //       res.status(200).send(result);
//   //     }
//   //   }
//   // );
// });

module.exports = router;
