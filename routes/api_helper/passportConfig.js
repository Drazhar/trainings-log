const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { hashPassword } = require('./password');
const { getTodayDate } = require('./utilities');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email, done) => {
    require('../../src/mySQL').query(
      `SELECT * FROM user WHERE email = '${email}'`,
      (err, rows) => {
        done(err, rows[0]);
      }
    );
  });

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        req.db.query(
          `SELECT * FROM user WHERE email = '${email}'`,
          (err, rows) => {
            if (err) return done(err);
            if (rows.length) {
              return done(null, false, { message: 'Email already taken.' });
            } else {
              hashPassword(password).then((hashedPass) => {
                const insertQuery = `INSERT INTO user ( email, password, date_joined ) VALUES ('${email}','${hashedPass}', '${getTodayDate()}')`;
                req.db.query(insertQuery, (err, rows) => {
                  return done(null, { email });
                });
              });
            }
          }
        );
      }
    )
  );

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        req.db.query(
          `SELECT * FROM user WHERE email = '${email}'`,
          (err, rows) => {
            if (err) return done(err);
            if (!rows.length) {
              return done(null, false, { message: 'user not found' });
            }

            bcrypt.compare(password, rows[0].password).then((result) => {
              if (result) {
                return done(null, { email: rows[0].email });
              } else {
                return done(null, false, { message: 'wrong password' });
              }
            });
          }
        );
      }
    )
  );
};
