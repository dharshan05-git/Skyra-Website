import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, trim: true, maxlength: 120 },
  comment: { type: String, trim: true, maxlength: 2000 },
  approved: { type: Boolean, default: false, index: true },
}, { timestamps: true });

schema.index({ product: 1, user: 1 }, { unique: true });
schema.index({ product: 1, approved: 1, createdAt: -1 });
export default mongoose.models.Review || mongoose.model('Review', schema);
