import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
const image = z.object({ url: z.string().trim().min(1), publicId: z.string().optional(), alt: z.string().max(180).optional(), isPrimary: z.boolean().optional() });
const variant = z.object({ sku: z.string().trim().max(80).optional().or(z.literal('')), group: z.string().trim().max(80).optional(), value: z.string().trim().max(100).optional(), name: z.string().trim().min(1).max(100), price: z.number().min(0).optional(), stock: z.number().int().min(0).optional(), active: z.boolean().optional() });
const specification = z.object({ label: z.string().trim().min(1).max(80), value: z.string().trim().min(1).max(300) });
const body = z.object({
  name: z.string().trim().min(2).max(180), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  sku: z.string().trim().max(80).optional(), description: z.string().max(10000).optional(), category: objectId,
  price: z.number().min(0), compareAtPrice: z.number().min(0).optional(), discount: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0).optional(), lowStockThreshold: z.number().int().min(0).optional(),
  variants: z.array(variant).refine((items) => { const skus = items.map((item) => item.sku?.toUpperCase()).filter(Boolean); return new Set(skus).size === skus.length; }, 'Variant SKUs must be unique').optional(), specifications: z.array(specification).max(30).optional(), images: z.array(image).max(20).optional(), tags: z.array(z.string().trim().max(50)).max(30).optional(),
  featured: z.boolean().optional(), hot: z.boolean().optional(), newArrival: z.boolean().optional(), active: z.boolean().optional(),
});

export const createProductSchema = z.object({ body });
export const updateProductSchema = z.object({ params: z.object({ id: objectId }), body: body.partial().refine((v) => Object.keys(v).length, 'At least one field is required') });
export const productIdSchema = z.object({ params: z.object({ id: objectId }) });
export const productSlugSchema = z.object({ params: z.object({ slug: z.string().regex(/^[a-z0-9-]+$/) }) });
