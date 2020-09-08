// Imports
const express = require('express');
const mysql = require('mysql');
const private = require('./src/variables.private.js');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

// Basic settings
const app = express();
const port = process.env.PORT || 3000;

// Static routes
app.use(express.static('static'));

// Connect to database
const connectionPool = (pool = mysql.createPool({
  connectionLimit: 10,
  user: private.user,
  password: private.password,
  database: private.database,
}));

// Session Store
const sessionStore = new MySQLStore({}, connectionPool);

// Middleware
app.use(
  session({
    key: 'session_cookie_name',
    secret: 'H4Hgg0jaCTc3uLvAmkdOgBg4PM20kHHN',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  console.log(req.session);
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header(
  //   'Access-Control-Allow-Headers',
  //   'Origin, X-Requested-With, Content-Type, Accept'
  // );
  req.db = connectionPool; // pass the database connection pool to each request
  next();
});

// Routes
app.get('/', (req, res) => res.sendFile('index.html'));
app.use('/api', require('./routes/api'));

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = { connectionPool };
