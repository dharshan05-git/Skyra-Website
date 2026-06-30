import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { success } from '../utils/ApiResponse.js';
export const listCategories = async (_req, res) => success(res, { categories: await Category.find({ active: true, archived: { $ne: true } }).sort({ sortOrder: 1, name: 1 }).lean() });
export const getCategory = async (req, res) => { const category = await Category.findOne({ slug: req.params.slug, active: true, archived: { $ne: true } }).lean(); if (!category) throw new ApiError(404, 'Category not found'); const productCount = await Product.countDocuments({ category: category._id, active: true, archived: { $ne: true } }); return success(res, { category: { ...category, productCount } }); };
