import { success } from '../utils/ApiResponse.js';
import * as cart from '../services/cart.service.js';
export const getCart = async (req, res) => success(res, await cart.getCart(req.user._id));
export const addItem = async (req, res) => success(res, await cart.addItem(req.user._id, req.body), 'Item added', 201);
export const updateItem = async (req, res) => success(res, await cart.updateItem(req.user._id, req.params.itemId, req.body.quantity), 'Cart updated');
export const removeItem = async (req, res) => success(res, await cart.removeItem(req.user._id, req.params.itemId), 'Item removed');
export const clearCart = async (req, res) => success(res, await cart.clearCart(req.user._id), 'Cart cleared');
