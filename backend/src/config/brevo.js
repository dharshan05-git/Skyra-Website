import { BrevoClient } from '@getbrevo/brevo';
import { env } from './env.js';

export function createEmailClient() {
  if (!env.BREVO_API_KEY) return null;
  return new BrevoClient({ apiKey: env.BREVO_API_KEY, timeout: 10000, maxRetries: 2 });
}
