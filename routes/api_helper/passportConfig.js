const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { hashPassword } = require('./password');
const { getTodayDate } = require('./utilities');
const { nanoid } = require('nanoid');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.userID);
  });

  passport.deserializeUser((userID, done) => {
    require('../../src/mySQL').query(
      `SELECT * FROM user WHERE id = '${userID}'`,
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
              const userID = nanoid(8);
              hashPassword(password).then((hashedPass) => {
                const insertQuery = `INSERT INTO user ( id, email, password, date_joined ) VALUES ('${userID}', '${email}','${hashedPass}', '${getTodayDate()}')`;
                req.db.query(insertQuery, (err, rows) => {
                  return done(null, { userID });
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
                return done(null, { userID: rows[0].id });
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
