import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource identifier';
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = 'A resource with that value already exists';
  } else if (error?.code?.startsWith?.('auth/')) {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  }
  const payload = { success: false, message };
  if (error.details) payload.details = error.details;
  if (!isProduction && error.stack) payload.stack = error.stack;
  res.status(statusCode).json(payload);
}
