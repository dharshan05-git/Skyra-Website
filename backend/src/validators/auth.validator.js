import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Invalid mobile number')
      .optional()
      .or(z.literal('')),
  }),
});

export const registerSyncSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().optional(),
  }),
});
