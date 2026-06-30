import { success } from '../utils/ApiResponse.js';
import * as wishlist from '../services/wishlist.service.js';
export const getWishlist = async (req, res) => success(res, await wishlist.getWishlist(req.user._id));
export const addItem = async (req, res) => success(res, await wishlist.addWishlistItem(req.user._id, req.body.productId), 'Wishlist updated', 201);
export const removeItem = async (req, res) => success(res, await wishlist.removeWishlistItem(req.user._id, req.params.productId), 'Wishlist updated');
export const clearWishlist = async (req, res) => success(res, await wishlist.clearWishlist(req.user._id), 'Wishlist cleared');
