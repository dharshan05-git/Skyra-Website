import { z } from 'zod';

export const updateShippingSettingsSchema = z.object({
  body: z.object({
    freeShippingAll: z.boolean().optional(),
    freeShippingEnabled: z.boolean().optional(),
    fixedShippingRate: z.number().min(0).optional(),
    freeShippingThreshold: z.number().min(0).optional(),
  }),
});

