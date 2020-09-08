const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { hashPassword } = require('./password');
const { getTodayDate } = require('./utilities');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    connection.query(`SELECT * FROM user WHERE id = ${id}`, (err, rows) => {
      done(err, rows[0]);
    });
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
                let newUserMysql = new Object();
                newUserMysql.email = email;
                const insertQuery = `INSERT INTO user ( email, password, date_joined ) VALUES ('${email}','${hashedPass}', '${getTodayDate()}')`;
                req.db.query(insertQuery, (err, rows) => {
                  newUserMysql.id = rows.insertId;

                  return done(null, newUserMysql);
                });
              });
            }
          }
        );
      }
    )
  );
};
