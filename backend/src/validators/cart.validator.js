import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID');

export const cartItemSchema = z.object({
  body: z.object({
    productId: objectId,
    variantSku: z.string().trim().min(1).optional().nullable(),
    quantity: z.number().int().min(1).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(0),
  }),
  params: z.object({
    itemId: objectId,
  }),
});

export const cartItemIdParamSchema = z.object({
  params: z.object({
    itemId: objectId,
  }),
});

