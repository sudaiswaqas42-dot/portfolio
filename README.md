# Portfolio

Run commands from this directory. Node dependencies and the lockfile are shared.

- `frontend/src/`: React pages, admin UI, components, styles and motion.
- `frontend/public/`: fonts, photographs, videos, CSS and Lottie assets. Public URLs remain `/images/…`, `/documents/…`, etc.
- `frontend/dist/`: generated production website (`npm run build`).
- `frontend/legacy/`: preserved static exports, original assets and earlier investigation files; not served or included in the build.
- `backend/server/`: Express API, authentication, validation, MySQL initialization and migrations.
- `backend/data/`: database migration seed content.
- `backend/uploads/`: persistent uploaded media, served at `/uploads/…`.
- `backend/tests/` and `backend/scripts/`: validation and integration checks.
- `backend/.env`: existing local database and signing configuration (keep private).
- `scripts/dev.cjs`: starts both development processes.

## Run

`npm install`, then `npm run dev`. The frontend is at http://127.0.0.1:3000 and the API at http://127.0.0.1:5000. Vite forwards `/api` and `/uploads` to the backend.

For production: `npm run build`, then `npm start`. Express serves the built frontend and supports direct navigation to `/about`, `/work`, `/login`, `/admin`, and legacy `.html` routes.

Use `npm run db:init` only when provisioning a database. Normal startup applies the existing non-destructive migrations. Existing data is retained.

## Verify

`npm test` checks gallery assets and content validation. With the backend running, `npm run verify:api` checks authentication, settings persistence, uploads, project editing and stale revisions. It temporarily changes the name and creates a verification project, then restores the name and removes that project. Test uploads and audit history are retained.

The hero uses General → First name / Last name. Dynamic SVG lettering is fitted inside the original Lottie name layers; the authored mouse keyframes, mask and moving project preview are retained. The frontend fallback data is used only while the API is loading or unavailable.

`npm run verify:site` checks the eight production routes and the current portfolio's referenced media against the running backend, without changing content.
