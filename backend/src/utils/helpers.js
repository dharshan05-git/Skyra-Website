import crypto from 'node:crypto';

export const normalizeId = (value) => String(value?._id ?? value ?? '');
export const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
export const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

export function escapeRegex(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
