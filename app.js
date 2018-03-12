const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();

// MongoDb connection
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_DB_ATLAS_URI);

// Middlewares
app.use(logger('dev'));
app.use(cors({ credentials: true }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
