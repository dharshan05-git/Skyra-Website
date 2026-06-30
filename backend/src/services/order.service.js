import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ShippingSettings from '../models/ShippingSettings.js';
import SiteSettings from '../models/SiteSettings.js';
import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { roundMoney } from '../utils/helpers.js';

export async function calculateSummary(userId) {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart?.items.length) throw new ApiError(400, 'Cart is empty');
  const items = [];
  for (const item of cart.items) {
    const product = item.product; if (!product?.active) throw new ApiError(409, 'A cart product is unavailable');
    const variant = item.variantSku ? product.variants.find((v) => v.sku === item.variantSku && v.active) : null;
    if (item.variantSku && !variant) throw new ApiError(409, `${product.name} variant is unavailable`);
    if (item.quantity > (variant ? variant.stock : product.stock)) throw new ApiError(409, `${product.name} has insufficient stock`);
    const unitPrice = roundMoney((variant?.price ?? product.price) * (1 - product.discount / 100));
    items.push({ product: product._id, name: product.name, sku: product.sku, variantSku: item.variantSku, image: product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url, quantity: item.quantity, unitPrice, lineTotal: roundMoney(unitPrice * item.quantity) });
  }
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const [shipping, site] = await Promise.all([
    ShippingSettings.findOne({ key: 'default' }).lean(),
    SiteSettings.findOne({ key: 'default' }).lean(),
  ]);
  const shippingCost = shipping?.freeShippingAll || (shipping?.freeShippingEnabled && subtotal >= (shipping.freeShippingThreshold || 0)) ? 0 : (shipping?.fixedShippingRate || 0);
  const tax = roundMoney(subtotal * (site?.taxRate || 0) / 100);
  return { items, subtotal, shippingCost, tax, total: roundMoney(subtotal + shippingCost + tax) };
}

const orderNumber = () => `${env.ORDER_NUMBER_PREFIX}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
let transactionSupport;
async function supportsTransactions() {
  if (transactionSupport !== undefined) return transactionSupport;
  const hello = await mongoose.connection.db.admin().command({ hello: 1 });
  transactionSupport = Boolean(hello.setName || hello.msg === 'isdbgrid');
  return transactionSupport;
}
async function runAtomic(work) {
  if (!await supportsTransactions()) return work(null);
  const session = await mongoose.startSession();
  try { let result; await session.withTransaction(async () => { result = await work(session); }); return result; }
  finally { await session.endSession(); }
}
const stockUpdate = (item, amount, session) => {
  const path = item.variantSku ? 'variants.$[variant].stock' : 'stock';
  const options = item.variantSku ? { arrayFilters: [{ 'variant.sku': item.variantSku }] } : {};
  if (session) options.session = session;
  return Product.updateOne({ _id: item.product }, { $inc: { [path]: amount } }, options);
};

export async function createOrder(userId, input) {
  const summary = await calculateSummary(userId);
  let order;
  await runAtomic(async (session) => {
    const committed = [];
    try {
      for (const item of summary.items) {
        const stockPath = item.variantSku ? 'variants.$[variant].stock' : 'stock';
        const filter = item.variantSku
          ? { _id: item.product, active: true, variants: { $elemMatch: { sku: item.variantSku, active: true, stock: { $gte: item.quantity } } } }
          : { _id: item.product, active: true, stock: { $gte: item.quantity } };
        const options = item.variantSku ? { arrayFilters: [{ 'variant.sku': item.variantSku, 'variant.stock': { $gte: item.quantity } }] } : {};
        if (session) options.session = session;
        const result = await Product.updateOne(filter, { $inc: { [stockPath]: -item.quantity } }, options);
        if (result.modifiedCount !== 1) throw new ApiError(409, `${item.name} is no longer available in that quantity`);
        committed.push(item);
      }
      [order] = await Order.create([{
        orderNumber: orderNumber(), user: userId, items: summary.items, shippingAddress: input.shippingAddress,
        subtotal: summary.subtotal, discount: summary.discount, shippingCost: summary.shippingCost, tax: summary.tax,
        total: summary.total, currency: env.DEFAULT_CURRENCY,
        paymentProvider: input.paymentProvider, paymentStatus: 'pending',
        status: 'pending', inventoryCommitted: true,
        statusHistory: [{ status: 'pending' }],
      }], session ? { session } : {});
      if (input.paymentProvider === 'cod') {
        await Cart.updateOne({ user: userId }, { $set: { items: [] } }, session ? { session } : {});
      }
    } catch (error) {
      if (!session) await Promise.allSettled(committed.map((item) => stockUpdate(item, item.quantity, null)));
      throw error;
    }
  });
  return order;
}

export async function cancelOrder(order, changedBy, note) {
  if (order.paymentStatus === 'paid') throw new ApiError(409, 'Paid orders must be refunded before cancellation');
  if (['shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(order.status)) throw new ApiError(409, 'Order cannot be cancelled');
  await runAtomic(async (session) => {
    const restored = [];
    try {
      if (order.inventoryCommitted) for (const item of order.items) { await stockUpdate(item, item.quantity, session); restored.push(item); }
      order.status = 'cancelled'; order.inventoryCommitted = false; order.statusHistory.push({ status: 'cancelled', changedBy, note }); await order.save(session ? { session } : {});
    } catch (error) {
      if (!session) await Promise.allSettled(restored.map((item) => stockUpdate(item, -item.quantity, null)));
      throw error;
    }
  });
  return order;
}

const manualWorkflow = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'completed'];

export async function updateOrderWorkflow(order, input, changedBy) {
  if (input.status === 'cancelled') return cancelOrder(order, changedBy, input.note);
  if (order.status === 'cancelled') throw new ApiError(409, 'Cancelled orders cannot be moved forward');
  if (!manualWorkflow.includes(input.status)) throw new ApiError(400, 'Invalid order status');
  if (input.status === order.status) return order;
  order.status = input.status;
  if (input.estimatedDeliveryDate !== undefined) order.estimatedDeliveryDate = input.estimatedDeliveryDate ? new Date(input.estimatedDeliveryDate) : undefined;
  if (input.status === 'shipped' && !order.estimatedDeliveryDate) { const estimate = new Date(); estimate.setDate(estimate.getDate() + 5); order.estimatedDeliveryDate = estimate; }
  order.statusHistory.push({ status: input.status, note: input.note, changedBy });
  await order.save();
  return order;
}

const shouldRestoreInventoryOnDelete = (order) => order.inventoryCommitted && order.paymentStatus !== 'paid' && !['shipped', 'in_transit', 'out_for_delivery', 'delivered', 'completed'].includes(order.status);

export async function deleteAdminOrders(filter = {}) {
  const orders = await Order.find(filter);
  let restored = 0;
  for (const order of orders) {
    if (shouldRestoreInventoryOnDelete(order)) {
      for (const item of order.items) await stockUpdate(item, item.quantity, null);
      restored += 1;
    }
  }
  const ids = orders.map((order) => order._id);
  const result = ids.length ? await Order.deleteMany({ _id: { $in: ids } }) : { deletedCount: 0 };
  return { deletedCount: result.deletedCount || 0, restoredInventoryOrders: restored };
}

export async function findOwnedOrder(id, userId) { const order = await Order.findOne({ _id: id, user: userId }).lean(); if (!order) throw new ApiError(404, 'Order not found'); return order; }
