const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, res, statusCode) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message: `User ${statusCode === 201 ? 'created' : 'logged in'}`,
    token
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Provide a valid email and paasword', 404));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.confirmPassword(password, user.password))) {
    return next(new AppError('Invalid Email or password', 401));
  }

  createSendToken(user, res, 200);
});
