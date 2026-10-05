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

The hero uses Home page → Hero → First name / Last name. Dynamic SVG lettering is fitted inside the original Lottie name layers; the authored mouse keyframes and mask are retained. The frontend fallback data is used only while the API is loading or unavailable.

`npm run verify:site` checks the eight production routes and the current portfolio's referenced media against the running backend, without changing content.

## Content Studio

Open `/admin`. Expand Home page, About page or Work page, then select a section. Header, contact and footer are shared; their changes update every page. Text, button labels and destinations, photographs, icons, videos, project galleries and colors are editable. Use Site settings → Brand & icons for a custom logo, favicon and browser metadata.

About page → Animated studio card contains the center image, large animated text and three small labels. The original scene is stored in `frontend/public/documents/studio-scene.json`. Only its image source and text layer values are replaced; the authored shader effects, layout and mouse behavior are preserved. A transparent image with roughly the original 1.8:1 aspect ratio fits the center logo best.

Changes remain in the draft while moving between sections. Publish changes saves the entire document in one MySQL transaction, with a revision check and a history snapshot. Discard restores the last published content. Blank optional fields stay blank after restarts. Uploads support JPG, PNG, WebP, GIF, MP4 and WebM (50 MB maximum); existing SVG icons can also be replaced by entering an image URL.

`shared/contentCatalog.json` defines the additional editable copy and assets. Values are persisted in `site_settings.content_json`; existing settings, biography, services and projects remain in their existing tables. Startup migrations add the storage without resetting content.

`npm run verify:cms` starts an isolated HTTP listener against the configured database and checks authentication, full-document publishing, persisted changes, blank copy, revision conflicts and rejection of unsafe links. It restores the edited fields afterward; audit history is retained. This check does not use a browser.
