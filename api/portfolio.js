import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default async function handler(req, res) {
  try {
    const { app } = require('../backend/server/server.cjs');
    req.url = '/api/portfolio';
    return app(req, res);
  } catch (err) {
    console.error('Portfolio endpoint error:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}
