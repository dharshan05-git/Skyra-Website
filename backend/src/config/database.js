import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';

export function normalizeMongoUri(uri) {
  if (!uri.startsWith('mongodb://') || !uri.includes('-shard-')) return uri;
  const credentialsEnd = uri.lastIndexOf('@');
  const pathStart = uri.indexOf('/', credentialsEnd);
  if (credentialsEnd < 0 || pathStart < 0) return uri;
  const credentials = uri.slice('mongodb://'.length, credentialsEnd);
  const firstHost = uri.slice(credentialsEnd + 1, pathStart).split(',')[0].split(':')[0];
  const atlasDomain = firstHost.replace(/^[^.]+\./, '');
  if (!atlasDomain.endsWith('.mongodb.net')) return uri;
  const database = uri.slice(pathStart + 1).split('?')[0] || 'admin';
  const query = new URLSearchParams(uri.includes('?') ? uri.slice(uri.indexOf('?') + 1) : '');
  const cluster = (query.get('appName') || 'Cluster0').toLowerCase();
  return `mongodb+srv://${credentials}@${cluster}.${atlasDomain}/${database}?retryWrites=true&w=majority&appName=${encodeURIComponent(query.get('appName') || 'Cluster0')}`;
}

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  const mongoUri = normalizeMongoUri(env.MONGODB_URI);
  if (mongoUri !== env.MONGODB_URI && mongoUri.startsWith('mongodb+srv://')) dns.setServers(['8.8.8.8', '1.1.1.1']);
  await mongoose.connect(mongoUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
