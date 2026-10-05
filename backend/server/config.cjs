const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
if (!process.env.JWT_SECRET) {
  const secret = crypto.randomBytes(48).toString('hex');
  if (process.env.NODE_ENV !== 'production' && fs.existsSync(envPath)) {
    try { fs.appendFileSync(envPath, `\nJWT_SECRET=${secret}\n`); } catch {}
  }
  process.env.JWT_SECRET = secret;
}
module.exports = { port: Number(process.env.PORT || 5000), secret: process.env.JWT_SECRET };
