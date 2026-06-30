import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { success } from '../../utils/ApiResponse.js';

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const dashboard = async (_req, res) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const chartStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const pendingStatuses = ['pending', 'confirmed', 'processing', 'packed'];
  const paidMatch = { paymentStatus: 'paid' };

  const [users, products, orders, pendingOrders, revenue, todaySales, recentOrders, lowStock, monthlyRevenue, paymentOverview, topProducts, orderStatusOverview] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ active: true }),
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: pendingStatuses } }),
    Order.aggregate([{ $match: paidMatch }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { ...paidMatch, createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email').lean(),
    Product.find({ active: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] } }).select('name slug sku stock lowStockThreshold').limit(20).lean(),
    Order.aggregate([{ $match: { ...paidMatch, createdAt: { $gte: chartStart } } }, { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$total' } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }]),
    Order.aggregate([{ $match: paidMatch }, { $group: { _id: '$paymentProvider', total: { $sum: '$total' }, orders: { $sum: 1 } } }, { $sort: { total: -1 } }]),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $unwind: '$items' }, { $group: { _id: '$items.product', name: { $first: '$items.name' }, image: { $first: '$items.image' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.lineTotal' } } }, { $sort: { sold: -1 } }, { $limit: 5 }]),
    Order.aggregate([{ $group: { _id: '$status', orders: { $sum: 1 }, value: { $sum: '$total' } } }, { $sort: { orders: -1 } }]),
  ]);

  const monthlyMap = new Map(monthlyRevenue.map((item) => [`${item._id.year}-${String(item._id.month).padStart(2, '0')}`, item.total]));
  const revenueChart = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1, label: date.toLocaleString('en-IN', { month: 'short' }), total: monthlyMap.get(monthKey(date)) || 0 };
  });
  const revenueTotal = revenue[0]?.total || 0;
  const paidOrders = paymentOverview.reduce((sum, item) => sum + item.orders, 0);

  return success(res, {
    stats: { users, products, orders, paidOrders, pendingOrders, revenue: revenueTotal, todaySales: todaySales[0]?.total || 0, averageOrderValue: paidOrders ? revenueTotal / paidOrders : 0 },
    recentOrders,
    lowStock,
    revenueChart,
    paymentOverview: paymentOverview.map((item) => ({ provider: item._id || 'unknown', total: item.total, orders: item.orders })),
    topProducts: topProducts.map((item) => ({ product: item._id, name: item.name, image: item.image, sold: item.sold, revenue: item.revenue })),
    orderStatusOverview: orderStatusOverview.map((item) => ({ status: item._id || 'unknown', orders: item.orders, value: item.value })),
  });
};
