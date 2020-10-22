const express = require('express');
const password = require('./api_helper/password');
const { isValidEmail } = require('./api_helper/emailValidation');
const passport = require('passport');
const router = express.Router();

const requireAuthentication = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(401);
    }
  };
};

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
    if (err) {
      console.log(err);
      next(err);
    }
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

router.post('/addWeight', requireAuthentication(), (req, res) => {
  const userID = req.user.id;
  const weight = req.body.weight;
  const date = req.body.date;

  req.db.query(
    `INSERT INTO weight (user_id, log_date, weight) VALUES('${userID}', '${date}', ${weight}) ON CONFLICT (user_id, log_date) DO UPDATE SET weight = ${weight};`,
    (error) => {
      if (error) throw error;
      res.sendStatus(200);
    }
  );
});

router.post('/removeWeight', requireAuthentication(), (req, res) => {
  const userId = req.user.id;
  const date = req.body.date;

  req.db.query(
    `DELETE FROM weight WHERE user_id='${userId}' AND log_date='${date}';`,
    (error) => {
      if (error) throw error;
      res.sendStatus(200);
    }
  );
});

router.get('/getWeight', requireAuthentication(), (req, res) => {
  let fromDateString = '';
  let toDateString = '';

  if ('fromDate' in req.query) {
    fromDateString = ` log_date >= '${req.query.fromDate}' AND`;
  }
  if ('toDate' in req.query) {
    toDateString = ` log_date <= '${req.query.toDate}' AND`;
  }
  req.db.query(
    `SELECT log_date, weight FROM weight WHERE${fromDateString}${toDateString} user_id = '${req.user.id}';`,
    (err, result) => {
      res.status(200).send(result.rows);
    }
  );
});

router.post('/editExercise', requireAuthentication(), (req, res) => {
  const userID = req.user.id;

  Object.keys(req.body).forEach((exerciseId) => {
    const name = req.body[exerciseId].name;
    const color = req.body[exerciseId].color;
    const description = req.body[exerciseId].description;

    req.db.query(
      `INSERT INTO exercise (exercise_id, exercise_name, user_id, color, description) VALUES('${exerciseId}', '${name}', '${userID}', '${color}', '${description}') ON DUPLICATE KEY UPDATE exercise_name=VALUES(exercise_name),user_id=VALUES(user_id),color=VALUES(color),description=VALUES(description);`,
      (error) => {
        if (error) throw error;

        req.body[exerciseId].logs.forEach((entry, index) => {
          if (entry.unit == '') {
            entry.unit = null;
          }

          req.db.query(
            `INSERT INTO log_table (exercise_id, i, name, unit) VALUES('${exerciseId}', ${index}, '${entry.name}', '${entry.unit}') ON DUPLICATE KEY UPDATE name=VALUES(name),unit=VALUES(unit);`,
            (error) => {
              if (error) throw error;
            }
          );
        });
      }
    );
  });
  res.sendStatus(200);
});

router.get('/getExercises', requireAuthentication(), (req, res) => {
  req.db.query(
    `SELECT * FROM exercise WHERE user_id = '${req.user.id}';`,
    (err, result_exercise) => {
      if (err) throw err;

      let callbackCounter = 0;
      for (let i = 0; i < result_exercise.length; i++) {
        promiseGetDate = new Promise((resolve, reject) => {
          req.db.query(
            `SELECT workout.workout_date AS date FROM workout JOIN training ON workout.workout_id = training.workout_id WHERE workout.user_id = '${req.user.id}' AND exercise_id = '${result_exercise[i].id}' ORDER BY workout.workout_date DESC LIMIT 1;`,
            (err, result_count) => {
              if (err) console.log('Error: ', err);

              if (result_count.length > 0) {
                result_exercise[i].lastUsed = result_count[0].date;
              }

              resolve();
            }
          );
        });

        promiseGetCount = new Promise((resolve, reject) => {
          req.db.query(
            `SELECT COUNT(training.exercise_id) AS count FROM workout JOIN training ON workout.workout_id = training.workout_id WHERE workout.user_id = '${req.user.id}' AND exercise_id = '${result_exercise[i].id}';`,
            (err, result_count) => {
              if (err) throw err;

              result_exercise[i].count = result_count[0].count;

              resolve();
            }
          );
        });

        promiseGetLogs = new Promise((resolve, reject) => {
          req.db.query(
            `SELECT log_name, unit FROM log_table WHERE exercise_id='${result_exercise[i].id}' ORDER BY i ASC;`,
            (err, result_logs) => {
              if (err) throw err;

              result_exercise[i].logs = result_logs;

              resolve();
            }
          );
        });

        Promise.all([promiseGetDate, promiseGetCount, promiseGetLogs]).then(
          () => {
            callbackCounter++;
            if (callbackCounter === result_exercise.length) {
              res.status(200).send(result_exercise);
            }
          }
        );
      }
    }
  );
});

router.post('/removeExercise', requireAuthentication(), (req, res) => {
  const userId = req.user.id;
  req.db.query(
    `DELETE FROM exercise WHERE exercise_id='${req.body.id}' AND user_id='${userId}';`,
    (error) => {
      if (error) throw error;
      res.sendStatus(200);
    }
  );
});

router.post('/editWorkout', requireAuthentication(), (req, res) => {
  const userID = req.user.id;
  Object.keys(req.body).forEach((workoutId) => {
    const date = req.body[workoutId].date;
    const comment = req.body[workoutId].comment;
    const mood = req.body[workoutId].mood;

    req.db.query(
      `DELETE FROM workout WHERE workout_id = '${workoutId}' AND user_id = '${userID}';`,
      (error) => {
        if (error) console.log(error);

        req.db.query(
          `INSERT INTO workout (workout_id, user_id, workout_date, comment, mood) VALUES('${workoutId}', '${userID}', '${date}', '${comment}', '${mood}') AS data ON DUPLICATE KEY UPDATE workout_date=data.workout_date,comment=data.comment,mood=data.mood;`,
          (error) => {
            if (error) console.log(error);

            req.body[workoutId].exercises.forEach((exercise, exerciseIndex) => {
              req.db.query(
                `INSERT INTO training (workout_id, i, exercise_id) VALUES('${workoutId}', ${exerciseIndex}, '${exercise.id}') ON DUPLICATE KEY UPDATE exercise_id=VALUES(exercise_id);`,
                (error) => {
                  if (error) console.log(error);

                  exercise.sets.forEach((set, setIndex) => {
                    set.forEach((value, valueIndex) => {
                      req.db.query(
                        `INSERT INTO training_values (workout_id, ex_number, set_number, value_i, value) VALUES('${workoutId}', ${exerciseIndex}, ${setIndex}, ${valueIndex}, ${value}) ON DUPLICATE KEY UPDATE value=VALUES(value);`,
                        (error) => {
                          if (error) console.log(error);
                        }
                      );
                    });
                  });
                }
              );
            });
          }
        );
      }
    );
  });
  res.sendStatus(200);
});

router.get('/getWorkouts', requireAuthentication(), (req, res) => {
  req.db.query(
    `SELECT workout.workout_id, workout.workout_date, workout.user_comment, workout.mood, training.i, training.exercise_id, training_values.set_number, training_values.value_i, training_values.value 
      FROM workout
      JOIN training ON workout.workout_id = training.workout_id 
      JOIN training_values ON training_values.workout_id = workout.workout_id 
      AND training_values.ex_number = training.i
      WHERE workout.user_id = '${req.user.id}'
      ORDER BY workout.workout_date DESC, training_values.set_number ASC;`,
    (err, result) => {
      if (err) console.log('Error: ', err);

      let returnObject = {};
      if (result.rows.length > 0) {
        result.rows.forEach((line) => {
          // console.log(line);
          if (!(`${line.workout_id}` in returnObject)) {
            returnObject[line.workout_id] = {
              date: line.workout_date,
              comment: line.user_comment,
              mood: line.mood,
              exercises: [],
            };
          }

          let keyExists = false;
          returnObject[line.workout_id].exercises.forEach((exercise) => {
            if (exercise.exercise_id == `${line.exercise_id}`) {
              keyExists = true;
            }
          });
          if (!keyExists) {
            returnObject[line.workout_id].exercises.push({
              id: line.exercise_id,
              // mood: line.exerciseMood,
              sets: [],
            });
          }

          returnObject[line.workout_id].exercises.forEach(
            (exercise, exIndex) => {
              if (exercise.workout_id == `${line.exercise_id}`) {
                if (
                  !returnObject[line.workout_id].exercises[exIndex].sets[
                    line.set_number
                  ]
                ) {
                  returnObject[line.workout_id].exercises[exIndex].sets.push(
                    []
                  );
                }

                returnObject[line.workout_id].exercises[exIndex].sets[
                  line.set_number
                ][line.value_i] = line.value;
              }
            }
          );
        });
      }
      res.status(200).send(returnObject);
    }
  );
});

router.post('/removeWorkout', requireAuthentication(), (req, res) => {
  req.db.query(
    `DELETE FROM workout WHERE id='${req.body.workoutId}' AND user_id='${req.user.id}';`,
    (error) => {
      if (error) throw error;
      res.sendStatus(200);
    }
  );
});

module.exports = router;
