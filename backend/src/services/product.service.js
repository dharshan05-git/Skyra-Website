import slugify from 'slugify';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import { escapeRegex } from '../utils/helpers.js';

const SORTS = { newest: '-createdAt', oldest: 'createdAt', price_asc: 'price', price_desc: '-price', name: 'name', name_desc: '-name' };
function normalizeProductInput(input) {
  const normalized = { ...input };
  const baseSlug = input.slug || (input.name ? slugify(input.name, { lower: true, strict: true }) : 'variant');
  if (!normalized.sku) delete normalized.sku;
  if (Array.isArray(input.variants)) normalized.variants = input.variants.map((variant, index) => ({ ...variant, sku: variant.sku || `${baseSlug}-${slugify(variant.group || 'option', { strict: true })}-${slugify(variant.value || variant.name || String(index + 1), { strict: true })}`.toUpperCase().slice(0, 80) }));
  return normalized;
}
export async function listProducts(query = {}, includeInactive = false) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 24));
  const filter = includeInactive ? { archived: { $ne: true } } : { active: true, archived: { $ne: true } };
  if (query.category) {
    const categoryTerms = [
      { slug: query.category },
      { name: { $regex: `^${escapeRegex(query.category)}$`, $options: 'i' } },
    ];
    if (mongoose.isValidObjectId(query.category)) categoryTerms.unshift({ _id: query.category });
    const category = await Category.findOne({
      $or: categoryTerms,
      archived: { $ne: true },
    }).select('_id').lean();
    filter.category = category?._id || (mongoose.isValidObjectId(query.category) ? query.category : null);
  }
  if (query.featured !== undefined) filter.featured = String(query.featured) === 'true';
  if (query.hot !== undefined) filter.hot = String(query.hot) === 'true';
  if (query.newArrival !== undefined) filter.newArrival = String(query.newArrival) === 'true';
  if (includeInactive && query.active !== undefined) filter.active = String(query.active) === 'true';
  if (query.search) filter.$or = [{ name: { $regex: escapeRegex(query.search), $options: 'i' } }, { sku: { $regex: escapeRegex(query.search), $options: 'i' } }];
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(SORTS[query.sort] || '-createdAt').skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
export async function getProductBySlug(slug) { const p = await Product.findOne({ slug, active: true, archived: { $ne: true } }).populate('category', 'name slug').lean(); if (!p) throw new ApiError(404, 'Product not found'); return p; }
export const createProduct = (input) => Product.create(normalizeProductInput({ ...input, slug: input.slug || slugify(input.name, { lower: true, strict: true }) }));
export async function updateProduct(id, input) { if (input.name && !input.slug) input.slug = slugify(input.name, { lower: true, strict: true }); const p = await Product.findByIdAndUpdate(id, normalizeProductInput(input), { new: true, runValidators: true }); if (!p) throw new ApiError(404, 'Product not found'); return p; }
