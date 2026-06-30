import { success } from '../utils/ApiResponse.js';
import { updateProfile } from '../services/auth.service.js';
import { resolveRole } from '../utils/roleResolver.js';

export const syncUser = async (req, res) => {
  if (req.body.name || req.body.phone !== undefined) req.user = await updateProfile(req.user._id, req.body);
  return success(res, { user: req.user }, 'User synchronized');
};
export const getProfile = async (req, res) => success(res, { user: req.user, role: await resolveRole(req.user._id) });
export const patchProfile = async (req, res) => success(res, { user: await updateProfile(req.user._id, req.body) }, 'Profile updated');
