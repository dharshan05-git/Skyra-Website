import Admin from '../models/Admin.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
export async function addAdmin(email, role, createdBy) { const user = await User.findOne({ email: email.toLowerCase() }); if (!user) throw new ApiError(404, 'User must sign in once before becoming an admin'); return Admin.findOneAndUpdate({ user: user._id }, { role, active: true, createdBy }, { upsert: true, new: true, runValidators: true }).populate('user', 'name email'); }
