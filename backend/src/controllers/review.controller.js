import Review from '../models/Review.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { success } from '../utils/ApiResponse.js';
export const listReviews = async (req, res) => success(res, { reviews: await Review.find({ product: req.params.productId, approved: true }).populate('user', 'name photoURL').sort({ createdAt: -1 }).lean() });
export const createReview = async (req, res) => { if (!await Product.exists({ _id: req.params.productId, active: true })) throw new ApiError(404, 'Product not found'); const review = await Review.findOneAndUpdate({ product: req.params.productId, user: req.user._id }, { ...req.body, approved: false }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }); return success(res, { review }, 'Review submitted for approval', 201); };
