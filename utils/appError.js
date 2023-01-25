//  we are making our own class but inheriting existing class from Error

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //  in stacktrace we dont want to add this method call so we have to write following code
    //  first this is for current object and second for current class i.e AppError
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
