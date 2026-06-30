import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
export async function updateProfile(userId, input) { const user = await User.findByIdAndUpdate(userId, input, { new: true, runValidators: true }); if (!user) throw new ApiError(404, 'User not found'); return user; }
