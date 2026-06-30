import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { success } from '../utils/ApiResponse.js';
import { applyWebhook, createRazorpayOrder, verifyPayment, verifyWebhook } from '../services/payment.service.js';
import { env } from '../config/env.js';

export const createPaymentOrder = async (req, res) => { const order = await Order.findOne({ _id: req.params.id, user: req.user._id }); if (!order) throw new ApiError(404, 'Order not found'); if (order.paymentProvider !== 'razorpay') throw new ApiError(409, 'This order does not use Razorpay'); const paymentOrder=await createRazorpayOrder(order);return success(res, { paymentOrder, keyId: env.RAZORPAY_KEY_ID, order_id: paymentOrder.id, amount: paymentOrder.amount, currency: paymentOrder.currency }, 'Payment order created', 201); };
export const verify = async (req, res) => success(res, { order: await verifyPayment(req.user._id, req.body) }, 'Payment verified');
export const paymentWebhook = async (req, res, next) => { try { verifyWebhook(req.body, req.get('x-razorpay-signature')); let event; try { event = JSON.parse(req.body.toString('utf8')); } catch { throw new ApiError(400, 'Invalid webhook payload'); } await applyWebhook(event); return res.status(200).json({ received: true }); } catch (error) { return next(error); } };
