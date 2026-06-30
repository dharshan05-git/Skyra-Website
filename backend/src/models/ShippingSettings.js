import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true },
  freeShippingAll: { type: Boolean, default: false },
  freeShippingEnabled: { type: Boolean, default: true },
  fixedShippingRate: { type: Number, min: 0, default: 0 },
  freeShippingThreshold: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

export default mongoose.models.ShippingSettings || mongoose.model('ShippingSettings', schema);
