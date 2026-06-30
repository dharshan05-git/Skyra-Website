import { z } from 'zod';
import { ORDER_STATUSES } from '../utils/constants.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid order ID');
const address = z.object({
  fullName: z.string().trim().min(2).max(120), email: z.string().email().optional(), phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  secondaryPhone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')), line1: z.string().trim().min(5).max(240),
  line2: z.string().trim().max(240).optional(), city: z.string().trim().min(2).max(100), state: z.string().trim().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/).optional(), postalCode: z.string().regex(/^\d{6}$/).optional(), country: z.string().max(80).optional(), notes: z.string().trim().max(500).optional(),
});

export const checkoutSummarySchema = z.object({ body: z.object({}).passthrough().optional() });
export const createOrderSchema = z.object({ body: z.object({ shippingAddress: address, primaryMobile: z.string().regex(/^[6-9]\d{9}$/).optional(), secondaryMobile: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')), notes: z.string().trim().max(500).optional(), paymentProvider: z.enum(['razorpay', 'cod']).default('razorpay') }).superRefine((value, context) => { if (!value.shippingAddress.phone && !value.primaryMobile) context.addIssue({ code: z.ZodIssueCode.custom, path: ['shippingAddress', 'phone'], message: 'Phone is required' }); if (!value.shippingAddress.pincode && !value.shippingAddress.postalCode) context.addIssue({ code: z.ZodIssueCode.custom, path: ['shippingAddress', 'pincode'], message: 'Pincode is required' }); }).transform((value) => ({ paymentProvider: value.paymentProvider, shippingAddress: { ...value.shippingAddress, phone: value.shippingAddress.phone || value.primaryMobile, secondaryPhone: value.shippingAddress.secondaryPhone || value.secondaryMobile, pincode: value.shippingAddress.pincode || value.shippingAddress.postalCode, notes: value.shippingAddress.notes || value.notes, postalCode: undefined, country: undefined } })) });
export const orderIdSchema = z.object({ params: z.object({ id: objectId }) });
export const updateOrderStatusSchema = z.object({ params: z.object({ id: objectId }), body: z.object({ status: z.enum(ORDER_STATUSES), note: z.string().trim().max(300).optional(), estimatedDeliveryDate: z.string().datetime().optional().nullable() }) });
export const deleteOrdersSchema = z.object({ body: z.object({ ids: z.array(objectId).max(500).optional(), all: z.boolean().optional() }).refine((value) => value.all || value.ids?.length, 'Select orders to delete or choose all orders') });
export const paymentVerificationSchema = z.object({ body: z.object({ orderId: objectId, razorpay_order_id: z.string().trim().min(1).max(100), razorpay_payment_id: z.string().trim().min(1).max(100), razorpay_signature: z.string().trim().regex(/^[a-f\d]{64}$/i, 'Invalid Razorpay signature format') }).strict() });
