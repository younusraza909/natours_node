const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No Document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // To run validator in update case also
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // First method to creat a tour
    // const newTour = new Tour({});
    // newTour.save();

    // Second Method
    const newDoc = await Model.create(req.body);

    //  Thing to remember that create method can take array of object to add multiple records at once

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });
