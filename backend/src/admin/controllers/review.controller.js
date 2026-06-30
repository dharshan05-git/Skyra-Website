import Review from '../../models/Review.js';
import ApiError from '../../utils/ApiError.js';
import { success } from '../../utils/ApiResponse.js';

export const listReviews = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const filter = req.query.approved === undefined || req.query.approved === '' ? {} : { approved: req.query.approved === 'true' };
  const [reviews, total] = await Promise.all([
    Review.find(filter).populate('user', 'name email photoURL').populate('product', 'name slug images').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Review.countDocuments(filter),
  ]);
  return success(res, { reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

export const updateReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true, runValidators: true }).populate('user', 'name email').populate('product', 'name slug');
  if (!review) throw new ApiError(404, 'Review not found');
  return success(res, { review }, req.body.approved ? 'Review approved' : 'Review hidden');
};

export const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  return success(res, null, 'Review deleted');
};
