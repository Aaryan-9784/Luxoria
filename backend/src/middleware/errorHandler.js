import ApiError from '../utils/ApiError.js';

/**
 * Global error handler middleware
 * Catches all errors and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ─── Mongoose Validation Error ─────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ─── Mongoose Duplicate Key Error ──────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `An account with this ${field} already exists`;
    errors = [{ field, message }];
  }

  // ─── Mongoose Cast Error (bad ObjectId) ────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─── JWT Errors ────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // ─── Log in development ────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', {
      statusCode,
      message,
      stack: err.stack,
      errors,
    });
  }

  // ─── Send Response ────────────────────────────────────────────
  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
      ...(errors.length > 0 && { errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export default errorHandler;
