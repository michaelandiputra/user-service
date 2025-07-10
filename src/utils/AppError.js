/**
 * Custom error class for handling operational errors.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Set status based on status code
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Mark as an operational error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;