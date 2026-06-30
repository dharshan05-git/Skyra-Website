import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  description: { type: String, trim: true, maxlength: 1000 },
  image: { url: String, publicId: String, alt: String },
  active: { type: Boolean, default: true, index: true },
  archived: { type: Boolean, default: false, index: true },
  archivedAt: Date,
  sortOrder: { type: Number, default: 0, index: true },
}, { timestamps: true });

categorySchema.index({ archived: 1, active: 1, sortOrder: 1, name: 1 });
export default mongoose.models.Category || mongoose.model('Category', categorySchema);
