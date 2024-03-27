const AppError = require('../utils/appError');

const handleCastErrorDB = error => {
  const message = `Invalid ${error.path}: at ${error.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
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
