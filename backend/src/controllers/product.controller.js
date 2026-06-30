import { success } from '../utils/ApiResponse.js';
import * as products from '../services/product.service.js';
export const listProducts = async (req, res) => success(res, await products.listProducts(req.query));
export const getProduct = async (req, res) => success(res, { product: await products.getProductBySlug(req.params.slug) });
