const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { hashPassword } = require('./password');
const { getTodayDate } = require('./utilities');
const { nanoid } = require('nanoid');
const connectionPool = require('../../src/postgreSQL');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.userID);
  });

  passport.deserializeUser((userID, done) => {
    connectionPool.query(
      `SELECT * FROM "user_account" WHERE "user_id" = '${userID}'`,
      (err, result) => {
        done(err, {
          email: result.rows[0].email,
          password: result.rows[0].pass,
          id: result.rows[0].user_id,
        });
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
          `SELECT * FROM user_account WHERE email = '${email}'`,
          (err, rows) => {
            if (err) return done(err);
            if (rows.length) {
              return done(null, false, { message: 'Email already taken.' });
            } else {
              const userID = nanoid(8);
              hashPassword(password).then((hashedPass) => {
                const insertQuery = `INSERT INTO user_account ( user_id, email, pass, date_joined ) VALUES ('${userID}', '${email}','${hashedPass}', '${getTodayDate()}')`;
                req.db.query(insertQuery, (err) => {
                  if (err) console.log('Error local signup: ', err);
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
          `SELECT * FROM user_account WHERE email = '${email}'`,
          (err, result) => {
            if (err) return done(err);
            if (!result.rows.length) {
              return done(null, false, { message: 'user not found' });
            }

            bcrypt
              .compare(password, result.rows[0].pass)
              .then((bcryptResult) => {
                if (bcryptResult) {
                  return done(null, { userID: result.rows[0].user_id });
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
