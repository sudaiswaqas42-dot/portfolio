import serverModule from '../backend/server/server.cjs';
const { app } = serverModule;

export default function handler(req, res) {
  req.url = '/api/portfolio';
  return app(req, res);
}
