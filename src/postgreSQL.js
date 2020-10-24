const { Pool } = require('pg');
const private = require('./variables.private.js');

// Connect to database
const connectionPool = (pool = new Pool({
  host: 'localhost',
  port: 5432,
  ssl: false,
  connectionLimit: 10,
  user: private.user,
  password: private.password,
  database: private.database,
  maxUses: 7500,
}));

module.exports = connectionPool;
