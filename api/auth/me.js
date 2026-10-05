import serverModule from '../../backend/server/server.cjs';
const { app } = serverModule;

export default function handler(req, res) {
  req.url = '/api/auth/me';
  return app(req, res);
}
