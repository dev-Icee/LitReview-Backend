const Review = require('./../Model/reviewModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/book-cover');
  },
  filename: (req, file, cb) => {
    console.log(req.body, file);
    const { title } = req.body;
    const uniqueSuffix = file.mimetype.split('/')[1];
    cb(null, `${title.split(' ').join('-')}-${Date.now()}.${uniqueSuffix}`);
  }
});

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File is not an Image', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadFile = upload.single('coverImage');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    return next(
      new AppError('No reviews at the moment. Check back later.', 204)
    );
  }

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const review = await Review.findById(req.params.id);

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

exports.updateReview = catchAsync(async (req, res, next) => {
  const update = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    status: 'success',
    data: { update }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});
