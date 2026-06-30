import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true },
  storeName: { type: String, default: 'SKYRA', maxlength: 100 },
  supportEmail: String,
  supportPhone: String,
  announcement: { type: String, maxlength: 300 },
  maintenanceMode: { type: Boolean, default: false },
  taxRate: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', schema);
