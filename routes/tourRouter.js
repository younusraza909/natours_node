const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  aliasTopTours,
  getMonthlyPlan,
  getToursWithin,
} = require('../controllers/tourControllers');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');
// const {
//   createReview,
//   getAllReviews,
// } = require('../controllers/reviewController');

const router = express.Router();

// POST /tour/1sdf23sa/reviews
// GET /tour/1sdf23sa/reviews
// GET /tour/1sdf23sa/reviews/332sdf3

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview)
//   .get(getAllReviews);

// Implementing Nesteing Routing using express
// but review router will not get access to tourId because of each router get access to its own params so we have to merge params
router.use('/:tourId/reviews', reviewRouter);

// Implementing Params Middleware
// in these types of middleware we have 4 values instead of 3 we get our params in last value in function
// router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tours-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guides'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
