import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { app } = require('../../backend/server/server.cjs');

export default function handler(req, res) {
  req.url = '/api/admin/upload';
  return app(req, res);
}
