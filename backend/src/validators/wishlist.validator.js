import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID');

export const wishlistItemSchema = z.object({
  body: z.object({
    productId: objectId,
  }),
});

export const wishlistProductParamSchema = z.object({
  params: z.object({
    productId: objectId,
  }),
});

