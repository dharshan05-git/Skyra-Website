import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { normalizeId } from '../utils/helpers.js';

const populate = { path: 'items.product', match: { active: true }, select: 'name slug price discount images featured hot newArrival' };
export async function getWishlist(userId) { return (await Wishlist.findOne({ user: userId }).populate(populate).lean()) || { user: userId, items: [] }; }
export async function addWishlistItem(userId, productId) { if (!await Product.exists({ _id: productId, active: true })) throw new ApiError(404, 'Product not found'); const list = await Wishlist.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { upsert: true, new: true }); if (!list.items.some((i) => normalizeId(i.product) === productId)) { list.items.push({ product: productId }); await list.save(); } await list.populate(populate); return list; }
export async function removeWishlistItem(userId, productId) { return (await Wishlist.findOneAndUpdate({ user: userId }, { $pull: { items: { product: productId } } }, { new: true }).populate(populate)) || { items: [] }; }
export async function clearWishlist(userId) { await Wishlist.updateOne({ user: userId }, { $set: { items: [] } }); return { items: [] }; }
