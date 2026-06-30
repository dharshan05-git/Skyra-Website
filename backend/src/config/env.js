import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default('skyra'),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional().or(z.literal('')),
  BREVO_SENDER_NAME: z.string().default('SKYRA'),
  ORDER_NUMBER_PREFIX: z.string().default('SKY'),
  DEFAULT_CURRENCY: z.string().length(3).default('INR'),
  ADMIN_SEED_EMAIL: z.string().email().optional().or(z.literal('')),
  ADMIN_SEED_FIREBASE_UID: z.string().optional(),
}).superRefine((value, context) => {
  if (value.NODE_ENV !== 'production') return;
  for (const key of ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET']) {
    if (!value[key]) context.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: `${key} is required in production` });
  }
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((i) => i.message).join(', ')}`);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
