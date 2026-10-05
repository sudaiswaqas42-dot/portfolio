import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { app } = require('../backend/server/server.cjs');

export default function handler(req, res) {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
