const AppError = require('../utils/appError');

const handleCastErrorDB = error => {
  const message = `Invalid ${error.path}: at ${error.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = error => {
  const { errors } = error;
  const message = Object.entries(errors)
    .map(el => el[1].message)
    .join(', ');
  return new AppError(`Invalid input data: ${message}`, 400);
};

const handleDuplicateKeyErrorDB = error => {
  const { title } = error.keyValue;
  const message = `Duplicate Error: ${title} review already exists in the database`;

  return new AppError(message, 404);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    errorStack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  }
};

module.exports = (err, req, res, next) => {
  err.status = 'error';
  err.message = err.message || 'Internal server error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.code === 11000) error = handleDuplicateKeyErrorDB(error);

    sendErrorProd(error, res);
  }
  // if (process.env.NODE_ENV === 'production') {
  //   sendErrorDev(err, res);
  //   // if (err.isOperational) {
  //   //   console.log('here');
  //   //   console.log(err);
  //   //   let error = { ...err };
  //   //   if (error.name === 'CastError') error = handleCastErrorDB(error);
  //   //   sendErrorProd(error, res);
  //   // }
  // }
};
