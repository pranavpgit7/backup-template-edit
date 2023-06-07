const createError = require('http-errors');
const express = require('express');
const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
const connectDB = require('./config/connection.js');
const session = require('express-session')
const ConnectMongodbSession = require('connect-mongodb-session')
const mongodbSession = new ConnectMongodbSession(session)

const path = require('path');
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

// Connect to mongodb
connectDB();

// Create Express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts)
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/backEnd')));

//Session
app.use(session({
  saveUninitialized: false,
  secret: 'session1234',
  resave: false,
  store: new mongodbSession({
    uri: 'mongodb://127.0.0.1:27017/spree',
    collection: "session"
  }),
  cookie: {
    maxAge: 1000 * 60 * 24 * 10,//10 days
  },
}))


app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
