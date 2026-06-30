import Admin from '../models/Admin.js';

export async function resolveRole(userId) {
  const admin = await Admin.findOne({ user: userId, active: true }).select('role').lean();
  return admin?.role || 'customer';
}
