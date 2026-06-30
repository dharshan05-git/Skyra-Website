import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server;
async function start() {
  await connectDatabase();
  server = app.listen(env.PORT, () => console.log(`SKYRA API listening on port ${env.PORT}`));
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
start().catch((error) => { console.error('Unable to start SKYRA API', error); process.exit(1); });
