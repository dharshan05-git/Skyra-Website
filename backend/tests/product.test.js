import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { createProductSchema, updateProductSchema } from '../src/validators/product.validator.js';

test('product validation rejects unsafe and incomplete input', () => {
  const result = createProductSchema.safeParse({ body: { name: '<script>', price: -1 } });
  assert.equal(result.success, false);
});

test('product validation accepts hot and new badge toggles', () => {
  const id = '507f1f77bcf86cd799439011';
  assert.equal(updateProductSchema.safeParse({ params: { id }, body: { hot: true } }).success, true);
  assert.equal(updateProductSchema.safeParse({ params: { id }, body: { newArrival: true } }).success, true);
});

test('invalid product slug is rejected before a database query', async () => {
  const response = await request(app).get('/api/products/not%20a%20slug').expect(400);
  assert.equal(response.body.message, 'Validation failed');
});
