const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  aliasTopTours,
} = require('../controllers/tourControllers');

const router = express.Router();

// Implementing Params Middleware
// in these types of middleware we have 4 values instead of 3 we get our params in last value in function
// router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tours-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
