import mongoose from 'mongoose';
import { ADMIN_ROLES } from '../utils/constants.js';

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  role: { type: String, enum: ADMIN_ROLES, default: 'admin', index: true },
  active: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
