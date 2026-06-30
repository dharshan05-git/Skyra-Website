import Order from '../models/Order.js';
import { calculateSummary, cancelOrder, createOrder, findOwnedOrder } from '../services/order.service.js';
import { success } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const checkoutSummary = async (req, res) => success(res, await calculateSummary(req.user._id));
export const placeOrder = async (req, res) => { req.body.shippingAddress.email ||= req.user.email; if (!req.body.shippingAddress.email) throw new ApiError(400, 'A delivery email is required'); return success(res, { order: await createOrder(req.user._id, req.body) }, 'Order created', 201); };
export const listOrders = async (req, res) => { const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10)); const filter = { user: req.user._id }; const [orders, total] = await Promise.all([Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Order.countDocuments(filter)]); return success(res, { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }); };
export const getOrder = async (req, res) => success(res, { order: await findOwnedOrder(req.params.id, req.user._id) });
export const cancelOwnedOrder = async (req, res) => { const order = await Order.findOne({ _id: req.params.id, user: req.user._id }); if (!order) throw new ApiError(404, 'Order not found'); return success(res, { order: await cancelOrder(order, req.user._id) }, 'Order cancelled'); };
