import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
export const categorySchema = z.object({ body: z.object({ name: z.string().trim().min(2).max(100), slug: z.string().regex(/^[a-z0-9-]+$/).optional(), description: z.string().max(1000).optional(), image: z.object({ url: z.string().url(), publicId: z.string().optional(), alt: z.string().optional() }).optional(), active: z.boolean().optional(), sortOrder: z.number().int().optional() }) });
export const categoryUpdateSchema = z.object({ params: z.object({ id: objectId }), body: categorySchema.shape.body.partial().refine((v) => Object.keys(v).length, 'At least one field is required') });
export const adminCreateSchema = z.object({ body: z.object({ email: z.string().email(), role: z.enum(['superadmin', 'admin', 'manager']).default('admin') }) });
export const adminUpdateSchema = z.object({ params: z.object({ id: objectId }), body: z.object({ role: z.enum(['superadmin', 'admin', 'manager']).optional(), active: z.boolean().optional() }).refine((v) => Object.keys(v).length, 'At least one field is required') });
export const idParamSchema = z.object({ params: z.object({ id: objectId }) });
