import mongoose from 'mongoose';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../utils/constants.js';

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: String,
  variantSku: String,
  image: String,
  quantity: { type: Number, min: 1, required: true },
  unitPrice: { type: Number, min: 0, required: true },
  lineTotal: { type: Number, min: 0, required: true },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, email: { type: String, required: true },
  phone: { type: String, required: true }, secondaryPhone: String,
  line1: { type: String, required: true }, line2: String, city: { type: String, required: true },
  state: { type: String, required: true }, pincode: { type: String, required: true }, notes: String,
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ORDER_STATUSES, required: true },
  note: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [itemSchema], required: true },
  shippingAddress: { type: addressSchema, required: true },
  subtotal: { type: Number, min: 0, required: true },
  discount: { type: Number, min: 0, default: 0 },
  shippingCost: { type: Number, min: 0, default: 0 },
  tax: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, required: true },
  currency: { type: String, default: 'INR' },
  couponCode: String,
  status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
  statusHistory: { type: [statusHistorySchema], default: [] },
  paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'pending', index: true },
  paymentProvider: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
  razorpayOrderId: { type: String, sparse: true, index: true },
  razorpayPaymentId: { type: String, sparse: true, index: true },
  paidAt: Date,
  estimatedDeliveryDate: Date,
  inventoryCommitted: { type: Boolean, default: false },
}, { timestamps: true, optimisticConcurrency: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ 'shippingAddress.email': 1, createdAt: -1 });
orderSchema.index({ 'shippingAddress.phone': 1, createdAt: -1 });
export default mongoose.models.Order || mongoose.model('Order', orderSchema);
