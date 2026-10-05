import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { app } = require('../backend/server/server.cjs');

export default app;
