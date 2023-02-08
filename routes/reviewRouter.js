const express = require('express');
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(protect, restrictTo('user'), setTourUserIds, createReview)
  .get(getAllReviews);

router.route('/:id').patch(updateReview).delete(deleteReview);

module.exports = router;
