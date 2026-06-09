const { AppError, ValidationError, NotFoundError, InternalServerError, UnauthorizedError, ForbiddenError } = require('../utils/errors-classes.util');


const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  if (!(err instanceof AppError)) {
    error = new InternalServerError(err.message);
  } else {
    error = err;
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  res.status(statusCode).json({
    success: false,
    status,
    message: error.message,
  });
};

module.exports = errorHandler;
