const User = require('./../Model/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError('No users at the moment. Check back later.', 204));
  }

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});
