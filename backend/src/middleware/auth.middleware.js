import { firebaseAuth } from '../config/firebase.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new ApiError(401, 'Authentication required');
  if (!firebaseAuth) throw new ApiError(503, 'Authentication service is not configured');
  const decoded = await firebaseAuth.verifyIdToken(match[1], true);
  const email = decoded.email?.toLowerCase();
  const identity = email ? { $or: [{ firebaseUid: decoded.uid }, { email }] } : { firebaseUid: decoded.uid };
  let user = await User.findOne(identity);
  if (user) {
    const wasSeeded = user.firebaseUid === 'demo-admin-user-id' || user.firebaseUid.startsWith('seed-admin-');
    const now = new Date();
    const updates = { firebaseUid: decoded.uid, lastLoginAt: now, lastSeenAt: now };
    if (email) updates.email = email;
    if (decoded.name && (!user.name || user.name === 'Customer' || wasSeeded)) updates.name = decoded.name;
    if (user.active === undefined) updates.active = true;
    user = await User.findByIdAndUpdate(user._id, { $set: updates }, { new: true, runValidators: true });
  } else {
    const now = new Date();
    user = await User.create({ firebaseUid: decoded.uid, email, name: decoded.name || 'Customer', lastLoginAt: now, lastSeenAt: now, active: true });
  }
  if (!user.active) throw new ApiError(403, 'Account is disabled');
  req.auth = decoded;
  req.user = user;
  next();
});

export const optionalAuthenticate = asyncHandler(async (req, _res, next) => {
  if (!req.get('authorization')) return next();
  return authenticate(req, _res, next);
});
