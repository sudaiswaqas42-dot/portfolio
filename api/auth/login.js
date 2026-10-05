import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    const { app } = require('../../backend/server/server.cjs');
    req.url = '/api/auth/login';
    return app(req, res);
  } catch (err) {
    console.error('Login endpoint error:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}
