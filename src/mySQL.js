const mysql = require('mysql');
const private = require('./variables.private.js');

// Connect to database
const connectionPool = (pool = mysql.createPool({
  connectionLimit: 20,
  user: private.user,
  password: private.password,
  database: private.database,
}));

module.exports = connectionPool;
