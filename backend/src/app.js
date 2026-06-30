import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env, isProduction } from './config/env.js';
import apiRouter from './routes/index.js';
import { paymentWebhook } from './controllers/payment.controller.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', isProduction ? 1 : false);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL.split(',').map((v) => v.trim()), credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use('/api/payments/webhook', rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }), express.raw({ type: 'application/json', limit: '256kb' }), paymentWebhook);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
if (!isProduction) app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/health', (_req, res) => res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
