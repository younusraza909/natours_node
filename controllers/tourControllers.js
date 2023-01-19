const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // Removing unwanted query string from our object
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFileds = ['page', 'sort', 'limit', 'fields'];

    excludedFileds.forEach((field) => delete queryObj[field]);

    // we are building query first because if use await it will execute query and return us document so we cant use other methods on it like sort , limit etc
    //  2)Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);

    let query = Tour.find(JSON.parse(queryStr));
    // Two ways to write filtering queries
    // const query =  Tour.find({
    //   duration: 5,
    // });

    // const query =  Tour.find()
    //   .where('difficulty')
    //   .equals(5)
    //   .where('x')
    //   .equals(1);

    //3) SORTING
    if (req.query.sort) {
      // In order to sort desc we have to add -sign before the key
      //  below code is to remove , between multiple sort keys user will send price,ratings and mongoose acceopt sort('price ratings')
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default Sort
      query = query.sort('-createdAt');
    }

    const tours = await query;

    // Send Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id}) alternative fields
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // First method to creat a tour
    // const newTour = new Tour({});
    // newTour.save();

    // Second Method
    const newTour = await Tour.create(req.body);

    //  Thing to remember that create method can take array of object to add multiple records at once

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // To run validator in update case also
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
};
