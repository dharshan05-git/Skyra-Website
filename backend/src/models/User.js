import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, trim: true, maxlength: 40 },
  fullName: { type: String, trim: true, maxlength: 120 },
  phone: { type: String, trim: true },
  line1: { type: String, trim: true, maxlength: 240 },
  line2: { type: String, trim: true, maxlength: 240 },
  city: { type: String, trim: true, maxlength: 100 },
  state: { type: String, trim: true, maxlength: 100 },
  pincode: { type: String, trim: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, lowercase: true, trim: true, index: true },
  name: { type: String, trim: true, maxlength: 120, default: 'Customer' },
  phone: { type: String, trim: true },
  photoURL: String,
  active: { type: Boolean, default: true, index: true },
  addresses: [addressSchema],
  lastLoginAt: Date,
  lastSeenAt: { type: Date, index: true },
}, { timestamps: true, optimisticConcurrency: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
