// Imports
const express = require('express');

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
app.post('/api/createSchedule', (req, res) => {});

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
