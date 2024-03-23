const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

module.exports = (err, req, res, next) => {
  err.status = 'error';
  err.message = err.message || 'Internal server error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      sendErrorProd(err, res);
    }
  }
};
