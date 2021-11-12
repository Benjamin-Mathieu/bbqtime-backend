const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const platsRouter = require('./routes/plats');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.disable('etag');

// Database
const db = require("./config/database");

// Testing the connection to the database
try {
  db.authenticate();
  console.log('Connection has been established successfully');
} catch (error) {
  console.error('Unable to connect to the database', error);
}

// Routes
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/plats', platsRouter);

module.exports = app;
