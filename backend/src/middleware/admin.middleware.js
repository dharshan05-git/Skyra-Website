import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAdmin = asyncHandler(async (req, _res, next) => {
  const admin = await Admin.findOne({ user: req.user._id, active: true }).lean();
  if (!admin) throw new ApiError(403, 'Administrator access required');
  req.admin = admin;
  next();
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) return next(new ApiError(403, 'Insufficient permissions'));
  return next();
};
