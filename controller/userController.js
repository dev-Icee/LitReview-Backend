const User = require('./../Model/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

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

exports.getUser = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.changeMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for changing password. Use the chnage password route.',
        400
      )
    );
  }

  const obj = filterObj(req.body, 'name', 'email');

  await User.findByIdAndUpdate(req.user._id, obj, {
    runValidator: true,
    new: true
  });

  res.status(200).json({
    status: 'success',
    message: 'user info updated successfully'
  });
});
