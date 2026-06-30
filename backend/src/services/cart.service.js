import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { normalizeId, roundMoney } from '../utils/helpers.js';

const populate = { path: 'items.product', select: 'name slug price discount stock variants images active' };
const totals = (cart) => { const items = cart?.items || []; return { items, itemCount: items.reduce((n, i) => n + i.quantity, 0), subtotal: roundMoney(items.reduce((n, i) => n + i.priceAtAdd * i.quantity, 0)) }; };
export async function getCart(userId) { return totals(await Cart.findOne({ user: userId }).populate(populate).lean()); }
export async function addItem(userId, { productId, variantSku, quantity }) {
  const product = await Product.findOne({ _id: productId, active: true }); if (!product) throw new ApiError(404, 'Product not found');
  const sku = variantSku?.trim().toUpperCase() || null; const variant = sku ? product.variants.find((v) => v.sku === sku && v.active) : null;
  if (sku && !variant) throw new ApiError(400, 'Invalid product variant');
  let cart = await Cart.findOne({ user: userId }); if (!cart) cart = new Cart({ user: userId, items: [] });
  const item = cart.items.find((i) => normalizeId(i.product) === productId && (i.variantSku || null) === sku);
  const requested = (item?.quantity || 0) + quantity; const available = variant ? variant.stock : product.stock;
  if (requested > available || requested > 20) throw new ApiError(409, 'Requested quantity is unavailable');
  const priceAtAdd = roundMoney((variant?.price ?? product.price) * (1 - product.discount / 100));
  if (item) { item.quantity = requested; item.priceAtAdd = priceAtAdd; } else cart.items.push({ product: productId, variantSku: sku, quantity, priceAtAdd });
  await cart.save(); await cart.populate(populate); return totals(cart.toObject());
}
export async function updateItem(userId, itemId, quantity) {
  const cart = await Cart.findOne({ user: userId }); const item = cart?.items.id(itemId); if (!item) throw new ApiError(404, 'Cart item not found');
  if (quantity === 0) item.deleteOne(); else { const product = await Product.findById(item.product); const variant = item.variantSku ? product?.variants.find((v) => v.sku === item.variantSku) : null; if (!product?.active || quantity > (variant ? variant.stock : product.stock) || quantity > 20) throw new ApiError(409, 'Requested quantity is unavailable'); item.quantity = quantity; }
  await cart.save(); await cart.populate(populate); return totals(cart.toObject());
}
export async function removeItem(userId, itemId) { const cart = await Cart.findOne({ user: userId }); if (!cart) return totals(); const item = cart.items.id(itemId); if (!item) throw new ApiError(404, 'Cart item not found'); item.deleteOne(); await cart.save(); await cart.populate(populate); return totals(cart.toObject()); }
export async function clearCart(userId) { await Cart.updateOne({ user: userId }, { $set: { items: [] } }); return totals(); }
