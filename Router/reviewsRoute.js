const express = require('express');

const reviewController = require('./../controller/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getReviews)
  .post(reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview);

module.exports = router;
