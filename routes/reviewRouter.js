const express = require('express');
const {
  createReview,
  getAllReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(protect, restrictTo('user'), createReview)
  .get(getAllReviews);

router.route('/:id').delete(deleteReview);

module.exports = router;
