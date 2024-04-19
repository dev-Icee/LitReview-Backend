const express = require('express');

const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.checkRole('admin'),
    reviewController.uploadFile,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.checkRole('admin'), reviewController.updateReview)
  .delete(authController.checkRole('admin'), reviewController.deleteReview);

module.exports = router;
