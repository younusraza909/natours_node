const express = require('express');
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(protect, restrictTo('user'), createReview)
  .get(getAllReviews);

router.route('/:id').patch(updateReview).delete(deleteReview);

module.exports = router;
