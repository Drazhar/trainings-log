// Imports
const express = require('express');
const { connectToDB } = require('./src/mysql');

// connect to database
let connectionDB = connectToDB().then(
  (res) => {
    console.log('connected as id ' + res.threadId);
    return res;
  },
  (rej) => {
    console.error('error connecting to mySQL server: ' + rej.stack);
    return false;
  }
);

// Basic settings
const app = express();
const port = 3000;

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

// APIs
app.get('/api/addUser', (req, res) => {
  connectionDB.query('SELECT * FROM user', (err, results) => {
    console.log('Error: ', err);
    console.log('Results: ', results);
  });
});

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
