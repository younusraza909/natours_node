/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const tourRouter = require('./routes/tourRouter');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');

const app = express();
// Express dont put body on request object by default so we have to add this middleware
// we are using limit here so we cant get to many data in body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against no sql injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());

// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// For serving static file
app.use(express.static(`${__dirname}/public`));

// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Helmet Set Security http headers
app.use(helmet());

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the sever!`,
  // });

  // In order to call our error handling middleware
  const err = new AppError(`Can't find ${req.originalUrl} on the sever!`, 404);

  //  we remove this code because we have make our own class
  // const err = new AppError(`Can't find ${req.originalUrl} on the sever!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // if we pass anything in next node will consider that there was an error and call that error handling middleware
  // it applies for all the next in each and every middleware
  // it will skip all the middleware in the stack and jump to error handling middleware
  next(err);
});

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
