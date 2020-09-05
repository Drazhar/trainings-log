const mysql = require('mysql');

function connectToDB() {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      user: 'root',
      password: 'pkH0j7cAXmeAm4UiuXeO',
      database: 'trainings_app',
    });

    connection.connect((err) => {
      if (err) {
        return reject(err);
      }

      return resolve(connection);
    });
  });
}

module.exports = { connectToDB };
