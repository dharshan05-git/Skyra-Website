import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: { type: String, uppercase: true, trim: true, default: null },
  quantity: { type: Number, required: true, min: 1, max: 20 },
  priceAtAdd: { type: Number, required: true, min: 0 },
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true, optimisticConcurrency: true });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
