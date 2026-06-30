import crypto from 'node:crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { razorpay } from '../config/razorpay.js';
import { env } from '../config/env.js';
import { safeEqual } from '../utils/helpers.js';
import { sendOrderConfirmation } from './email.service.js';

export function paymentAmountPaise(total) {
  const amount = Math.round(Number(total) * 100);
  if (!Number.isSafeInteger(amount) || amount < 100) throw new ApiError(400, 'Razorpay requires a minimum order amount of ₹1.00');
  return amount;
}

export function assertPaymentSignature({ orderId, paymentId, signature, secret }) {
  if (!orderId || !paymentId || !signature || !secret) throw new ApiError(400, 'Payment verification fields are incomplete');
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  if (!safeEqual(expected, signature)) throw new ApiError(400, 'Invalid payment signature');
  return true;
}

function providerError(error) {
  if (Number(error?.statusCode) === 401) return new ApiError(401, 'Razorpay authentication failed. Check the configured API keys.');
  return new ApiError(500, 'Unable to create the Razorpay payment order. Please try again.');
}

export async function createRazorpayOrder(order) {
  if (!razorpay) throw new ApiError(503, 'Payment service is not configured');
  if (order.paymentStatus === 'paid') throw new ApiError(409, 'Order is already paid');
  const amount = paymentAmountPaise(order.total);
  try {
    if (order.razorpayOrderId) return await razorpay.orders.fetch(order.razorpayOrderId);
    const paymentOrder = await razorpay.orders.create({ amount, currency: order.currency, receipt: order.orderNumber, notes: { orderId: String(order._id) } });
    order.razorpayOrderId = paymentOrder.id; await order.save(); return paymentOrder;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw providerError(error);
  }
}

export async function verifyPayment(userId, input) {
  const order = await Order.findOne({ _id: input.orderId, user: userId }); if (!order) throw new ApiError(404, 'Order not found');
  if (order.paymentStatus === 'paid') return order;
  if (!env.RAZORPAY_KEY_SECRET || order.razorpayOrderId !== input.razorpay_order_id) throw new ApiError(400, 'Payment verification failed');
  assertPaymentSignature({ orderId: input.razorpay_order_id, paymentId: input.razorpay_payment_id, signature: input.razorpay_signature, secret: env.RAZORPAY_KEY_SECRET });
  const paid = await Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: { $ne: 'paid' } },
    { $set: { paymentStatus: 'paid', status: 'confirmed', razorpayPaymentId: input.razorpay_payment_id, paidAt: new Date() }, $push: { statusHistory: { status: 'confirmed', changedBy: userId } } },
    { new: true, runValidators: true }
  );
  if (!paid) return Order.findById(order._id);
  await Cart.updateOne({ user: userId }, { $set: { items: [] } }); sendOrderConfirmation(paid).catch((error) => console.error('Order confirmation email failed', error.message)); return paid;
}

export function verifyWebhook(rawBody, signature) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) throw new ApiError(503, 'Webhook secret is not configured');
  const expected = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  if (!signature || !safeEqual(expected, signature)) throw new ApiError(400, 'Invalid webhook signature');
}

export async function applyWebhook(event) {
  if (!['payment.captured', 'payment.failed'].includes(event.event)) return;
  const payment = event.payload?.payment?.entity; if (!payment?.order_id) return;
  if (event.event === 'payment.failed') { await Order.updateOne({ razorpayOrderId: payment.order_id, paymentStatus: 'pending' }, { $set: { paymentStatus: 'failed' } }); return; }
  const candidate = await Order.findOne({ razorpayOrderId: payment.order_id }).lean();
  if (!candidate || payment.amount !== Math.round(candidate.total * 100) || payment.currency !== candidate.currency) throw new ApiError(400, 'Webhook payment does not match the order');
  const order = await Order.findOneAndUpdate({ _id: candidate._id, paymentStatus: { $ne: 'paid' } }, { $set: { paymentStatus: 'paid', status: 'confirmed', razorpayPaymentId: payment.id, paidAt: new Date() }, $push: { statusHistory: { status: 'confirmed' } } }, { new: true, runValidators: true });
  if (!order) return; await Cart.updateOne({ user: order.user }, { $set: { items: [] } }); sendOrderConfirmation(order).catch((error) => console.error('Order confirmation email failed', error.message));
}

export async function refundPayment(order, amount) {
  if (!razorpay) throw new ApiError(503, 'Payment service is not configured');
  if (order.paymentStatus !== 'paid' || !order.razorpayPaymentId) throw new ApiError(409, 'Only paid Razorpay orders can be refunded');
  const refundAmount = amount === undefined ? Math.round(order.total * 100) : Math.round(amount * 100);
  if (refundAmount !== Math.round(order.total * 100)) throw new ApiError(400, 'Only full refunds are currently supported');
  const refund = await razorpay.payments.refund(order.razorpayPaymentId, { amount: refundAmount, notes: { orderId: String(order._id) } });
  order.paymentStatus = 'refunded';
  await order.save();
  return refund;
}
