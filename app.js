const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Database
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("bbqtime", "root", "root", {
  dialect: "mysql",
  host: "localhost"
});

// Testing the connection
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully');
  sequelize.query("SELECT * FROM `users` WHERE 1").then(([results, metadata]) => {
    console.log(results);
  })
} catch (error) {
  console.error('Unable to connect to the database', error);
}

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
