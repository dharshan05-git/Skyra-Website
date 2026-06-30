import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import request from 'supertest';
import app from '../src/app.js';
import { safeEqual, roundMoney } from '../src/utils/helpers.js';
import { createOrderSchema, paymentVerificationSchema, updateOrderStatusSchema } from '../src/validators/order.validator.js';
import { assertPaymentSignature, paymentAmountPaise } from '../src/services/payment.service.js';

test('order validation accepts a complete Indian delivery address', () => {
  const result = createOrderSchema.safeParse({ body: { shippingAddress: { fullName: 'Aakash G', email: 'aakash@example.com', phone: '9876543210', line1: '12 Example Street', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' }, paymentProvider: 'razorpay' } });
  assert.equal(result.success, true);
});

test('payment verification requires a 64-character hex signature', () => {
  const result = paymentVerificationSchema.safeParse({ body: { orderId: '507f1f77bcf86cd799439011', razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_1', razorpay_signature: 'invalid' } });
  assert.equal(result.success, false);
});

test('signature comparison and currency rounding are deterministic', () => {
  const signature = createHmac('sha256', 'secret').update('order_1|pay_1').digest('hex');
  assert.equal(safeEqual(signature, signature), true);
  assert.equal(safeEqual(signature, `${signature.slice(0, -1)}0`), false);
  assert.equal(roundMoney(10.005), 10.01);
});

test('Razorpay order amount is converted to paise and enforces the minimum', () => {
  assert.equal(paymentAmountPaise(1), 100);
  assert.equal(paymentAmountPaise(49.5), 4950);
  assert.throws(() => paymentAmountPaise(0.99), (error) => error.statusCode === 400);
});

test('Razorpay signature verification accepts only the expected HMAC', () => {
  const secret = 'test-secret';
  const signature = createHmac('sha256', secret).update('order_1|pay_1').digest('hex');
  assert.equal(assertPaymentSignature({ orderId: 'order_1', paymentId: 'pay_1', signature, secret }), true);
  assert.throws(() => assertPaymentSignature({ orderId: 'order_1', paymentId: 'pay_1', signature: '0'.repeat(64), secret }), (error) => error.statusCode === 400);
  assert.throws(() => assertPaymentSignature({ orderId: '', paymentId: 'pay_1', signature, secret }), (error) => error.statusCode === 400);
});

test('Razorpay order creation keeps cart until payment verification', async () => {
  const source = await import('../src/services/order.service.js?test-cart-retention');
  assert.match(source.createOrder.toString(), /if \(input\.paymentProvider === 'cod'\) \{\s*await Cart\.updateOne/);
});

test('admin status validation supports the complete fulfilment workflow', () => {
  for (const status of ['pending', 'paid', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']) {
    const result = updateOrderStatusSchema.safeParse({ params: { id: '507f1f77bcf86cd799439011' }, body: { status, note: 'Status update' } });
    assert.equal(result.success, true, `${status} should be valid`);
  }
});

test('admin order APIs reject unauthenticated customers', async () => {
  const response = await request(app).get('/api/admin/orders').expect(401);
  assert.equal(response.body.message, 'Authentication required');
});
