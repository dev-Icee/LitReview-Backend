const express = require('express');

const reviewRouter = require('./Router/reviewsRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();
app.use(express.json());

app.use('/api/v1/litview', reviewRouter);
app.use('*', (req, res, next) => {
  return next(new AppError('The routes does not exist on this server', 404));
});
app.use(globalErrorHandler);

module.exports = app;
