const { Pool } = require('pg');

// Connect to database
const connectionPool = (pool = new Pool({
  host: process.env.DB_ADDRESS,
  port: process.env.DB_PORT,
  ssl: false,
  connectionLimit: 10,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  maxUses: 7500,
}));

module.exports = connectionPool;

console.log(process.env.PORT);
