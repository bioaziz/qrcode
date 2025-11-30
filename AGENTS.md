# Repository Guidelines

## Project Structure & Module Organization
- `pages/`: Next.js routes. API at `pages/api/*`, public pages under `pages/*` and studio routes under `pages/studio/*`.
- `components/`: Reusable UI and QR designer modules (`components/qr/*`, `components/ui/*`).
- `lib/`: Server/client helpers (QR generation, auth, DB, utils). Models in `models/`.
- `public/`: Static assets and `public/locales/*` for i18n. Docs in `docs/`. Tests in `__tests__/`.

## Build, Test & Development Commands
- `npm run dev`: Start Next.js dev server on port 3000.
- `npm run build`: Production build (`.next/`).
- `npm start`: Run the built app.
- `npm run lint`: Lint with ESLint (Next core-web-vitals rules).
- Tests use Node’s test runner: `node --test __tests__/**/*.test.js`.
- Docker (dev): `docker build -t qrcode . && docker run -p 3000:3000 qrcode`.

## Coding Style & Naming Conventions
- JavaScript/React with 2‑space indentation and semicolons.
- React components: PascalCase files and exports (e.g., `QRDesigner.jsx`).
- Pages and API routes: lower‑case with dashes or folders (e.g., `pages/api/qr/[id].js`).
- Prefer functional components and hooks; colocate small helpers near usage, otherwise in `lib/*`.
- Run `npm run lint` before pushing.

## Testing Guidelines
- Framework: Node `node:test` with `assert`.
- File pattern: `__tests__/*.test.js` matching the module name (e.g., `qr.test.js`).
- Focus areas: `lib/qr.js` (SVG/PNG), API handlers (`pages/api/*`).
- Example: `node --test __tests__/api-qrcode.test.js`.

## Commit & Pull Request Guidelines
- Commits: imperative, present tense, concise subject (≤72 chars). Optional scope: `api:`, `ui:`, `lib:`.
  - Example: `api: validate data for /v1/qrcode`
- PRs: clear description, linked issues, before/after screenshots for UI, steps to test, and notes on migrations or env vars.

## Security & Configuration Tips
- Secrets in `.env.local` (never commit): `NEXTAUTH_SECRET`, `MONGODB_URI`, OAuth client IDs, `GOOGLE_TRANSLATE_API_KEY`.
- Auth: NextAuth configured under `pages/api/auth/[...nextauth].js`; ensure `NEXTAUTH_URL` matches your dev/prod URL.
- i18n: Manage translations in `public/locales/*`; generate with `node scripts/generate-translations.js` when `GOOGLE_TRANSLATE_API_KEY` is set.
- Data: Use `models/*` with Mongoose; avoid long‑running work in API routes—prefer small, idempotent handlers.

