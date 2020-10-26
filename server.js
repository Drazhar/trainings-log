// Imports
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const connectionPool = require('./src/postgreSQL');
const path = require('path');

require('./routes/api_helper/passportConfig')(passport);

// Basic settings
const app = express();
const port = process.env.PORT || 3000;

// Static routes
app.use(express.static('static'));

// Middleware
app.use(
  session({
    key: 'userIdentifier',
    secret: 'secret',
    store: new pgSession({
      pool: connectionPool,
      tableName: 'user_session',
    }),
    resave: false,
    saveUninitialized: false, // Save even if not registered
    cookie: { maxAge: 30 * 86400000 },
  })
);
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8080'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, content-type, Accept'
  );
  req.db = connectionPool; // pass the database connection pool to each request
  next();
});
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', require('./routes/api'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
});

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
