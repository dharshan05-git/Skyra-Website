import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true }, publicId: String, alt: String,
  isPrimary: { type: Boolean, default: false },
}, { _id: false });

const variantSchema = new mongoose.Schema({
  sku: { type: String, uppercase: true, trim: true },
  group: { type: String, trim: true, maxlength: 80 },
  value: { type: String, trim: true, maxlength: 100 },
  name: { type: String, trim: true },
  price: { type: Number, min: 0 },
  stock: { type: Number, min: 0, default: 0 },
  active: { type: Boolean, default: true },
}, { _id: true });

const specificationSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true, maxlength: 80 },
  value: { type: String, required: true, trim: true, maxlength: 300 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  sku: { type: String, uppercase: true, trim: true, sparse: true, unique: true },
  description: { type: String, trim: true, maxlength: 10000 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  stock: { type: Number, min: 0, default: 0 },
  lowStockThreshold: { type: Number, min: 0, default: 5 },
  variants: { type: [variantSchema], default: [] },
  specifications: { type: [specificationSchema], default: [] },
  images: { type: [imageSchema], default: [] },
  tags: [{ type: String, lowercase: true, trim: true }],
  featured: { type: Boolean, default: false, index: true },
  hot: { type: Boolean, default: false, index: true },
  newArrival: { type: Boolean, default: false, index: true },
  active: { type: Boolean, default: true, index: true },
  archived: { type: Boolean, default: false, index: true },
  archivedAt: Date,
}, { timestamps: true, optimisticConcurrency: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ active: 1, category: 1, createdAt: -1 });
productSchema.index({ active: 1, featured: 1, createdAt: -1 });
productSchema.index({ active: 1, hot: 1, createdAt: -1 });
productSchema.index({ active: 1, newArrival: 1, createdAt: -1 });
productSchema.index({ archived: 1, active: 1, createdAt: -1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
