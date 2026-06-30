import Cart from '../../models/Cart.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import Review from '../../models/Review.js';
import Wishlist from '../../models/Wishlist.js';
import ApiError from '../../utils/ApiError.js';
import { success } from '../../utils/ApiResponse.js';
import { deleteImage } from '../../services/cloudinary.service.js';
import * as service from '../../services/product.service.js';

export const listProducts = async (req, res) => success(res, await service.listProducts(req.query, true));
export const createProduct = async (req, res) => success(res, { product: await service.createProduct(req.body) }, 'Product created', 201);
export const updateProduct = async (req, res) => {
  if (req.admin?.role === 'admin') {
    const allowed = new Set(['stock', 'active', 'featured', 'hot', 'newArrival']);
    const blocked = Object.keys(req.body).filter((key) => !allowed.has(key));
    if (blocked.length) throw new ApiError(403, 'Admins can only update product stock, active status, featured status, hot status, and new status');
  }
  return success(res, { product: await service.updateProduct(req.params.id, req.body) }, 'Product updated');
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) throw new ApiError(404, 'Product not found');
  if (await Order.exists({ 'items.product': product._id })) throw new ApiError(409, 'This product belongs to an order and cannot be permanently deleted. Disable it instead.');

  await Promise.all([
    Product.deleteOne({ _id: product._id }),
    Cart.updateMany({}, { $pull: { items: { product: product._id } } }),
    Wishlist.updateMany({}, { $pull: { items: { product: product._id } } }),
    Review.deleteMany({ product: product._id }),
  ]);
  await Promise.allSettled((product.images || []).map((image) => image.publicId ? deleteImage(image.publicId) : Promise.resolve()));
  return success(res, null, 'Product permanently deleted');
};
