import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('health endpoint reports readiness', async () => {
  const response = await request(app).get('/health').expect(200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, 'ok');
});

test('protected endpoint rejects a missing Firebase token', async () => {
  const response = await request(app).get('/api/auth/me').expect(401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Authentication required');
});
