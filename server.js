// Imports
const express = require('express');
const mysql = require('mysql');
const private = require('./src/variables.private.js');
const { render } = require('sass');

// Basic settings
const app = express();
const port = process.env.PORT || 3000;

// Connect to database
const connectionPool = (pool = mysql.createPool({
  connectionLimit: 10,
  user: private.user,
  password: private.password,
  database: private.database,
}));

app.use((req, res, next) => {
  req.db = connectionPool;
  next();
});

// Middleware
app.use(express.json({ limit: '100kb' }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Routes
app.use('/api', require('./routes/api'));

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = { connectionPool };
