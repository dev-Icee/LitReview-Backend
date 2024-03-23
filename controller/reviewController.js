const Review = require('./../Model/reviewModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    console.log('no reviews');
    res.status(404);
  }

  res.status(200).json({
    status: 'success',
    data: { reviews }
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    next(new AppError('No review with the provided id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    message: 'success',
    data: {
      review
    }
  });
});
