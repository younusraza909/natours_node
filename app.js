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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on the sever!`,
  });
});

module.exports = app;
