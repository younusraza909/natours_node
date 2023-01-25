const express = require('express');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();
// Express dont put body on request object by default so we have to add this middleware
app.use(express.json());

// For serving static file
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the sever!`,
  // });

  // In order to call our error handling middleware
  const err = new Error(`Can't find ${req.originalUrl} on the sever!`);
  err.status = 'fail';
  err.statusCode = 404;

  // if we pass anything in next node will consider that there was an error and call that error handling middleware
  // it applies for all the next in each and every middleware
  // it will skip all the middleware in the stack and jump to error handling middleware
  next(err);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
