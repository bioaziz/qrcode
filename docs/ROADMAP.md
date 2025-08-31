# GeniusQR Roadmap

This document summarizes what shipped in Week 1 and outlines the next milestones for Weeks 2–4 and beyond. It is tailored to the current Next.js (Pages Router) + NextAuth + MongoDB setup in this repo.

## Week 1 — Delivered

- Frontend polish
  - Installed shadcn/ui parts and integrated them project‑wide (inputs, selects, sliders, switches, radio group, tabs, tooltip, dropdown, textarea, sonner toaster).
  - Added `ThemeProvider` + `Toaster` in `pages/_app.js` for dark mode and notifications.
  - Refactored `QRDesigner` to use shadcn components, added Tabs (Content, Style, Corners, Logo, Presets), icons for visual cues, and responsive layouts.
  - Added cards and consistent spacing; preview scales on mobile devices.
- Docker dev UX
  - Enabled hot‑reloading via compose volume mounts and file‑watcher envs.
- Backend foundations
  - Models: `models/Tenant.js`, `models/Design.js`, `models/QrCode.js`.
  - Auth helper: `lib/auth.js` (session gate for APIs).
  - CRUD API for QR codes:
    - `GET/POST  pages/api/qr/index.js` — list, create.
    - `GET/PATCH/DELETE  pages/api/qr/[id].js` — read, update, archive.
  - Minimal Studio list screen: `pages/studio/qrs.js` (search, quick create, open links).

### How to run

- Local: `npm run dev` (http://localhost:3000)
- Docker: `docker compose up --build` (http://localhost:3008)
  - Hot reload: code is mounted into the container; watcher polling enabled.

### Data model snapshot (Week 1)

- Tenant: name, slug, owners, plan, apiKeys.
- Design: mirrors QRDesigner options (dot/bg, gradients, corners, ECC, quietZone, imageSize).
- QrCode: owner, slug, type (static/dynamic/...), staticPayload, dynamicConfig (rules/rotation/ab‑splits), designRef, status, meta, security.

### API snapshot (Week 1)

- List: `GET /api/qr?q=&status=&type=&limit=&offset=`
- Create: `POST /api/qr` → `{ type, staticPayload, dynamicConfig, meta, designRef }`
- Read: `GET /api/qr/:id`
- Update: `PATCH /api/qr/:id`
- Archive: `DELETE /api/qr/:id` (sets status=archived)

## Week 2 — Planned

- Redirector route
  - Add `pages/r/[slug].js` to resolve a `QrCode` and 302 to the computed destination.
  - Resolve logic (initial version):
    - If `type=static` → use `staticPayload`.
    - If `type=dynamic` → use `dynamicConfig.primaryUrl` (rules/rotation in Week 3).
    - If missing/paused → fallback page.
- Event logging (Redis)
  - Log scan events with timestamp, `qrId`, `slug`, country (GeoIP), city, UA/device hints.
  - Use per‑slug counters and daily buckets for quick charts: `qr:{slug}:hits`, `qr:{slug}:hits:YYYYMMDD`.
- Analytics worker
  - A serverless/cron job to aggregate Redis events to Mongo for long‑term storage (daily rollups).
- Dashboard
  - `pages/studio/analytics.js` — per‑QR charts: total scans, daily trend, top countries/cities, devices.

Acceptance
- 302 redirector live at `/r/[slug]`.
- Redis keys increment on scans; basic chart data available.
- Simple analytics view renders for a selected QR.

## Week 3 — Planned

- Behavior rules and rotation
  - Apply time‑based and geo‑based rules to choose destination.
  - Add A/B split routing and TOTP/interval rotation.
- Micro‑app scaffold and pay‑later flow
  - Create a minimal micro‑app page template (for campaign/landing experiences).
  - Add stubs for pay‑later flow integration.

## Week 4 — Planned

- Studio UI finalize
  - Full list/edit/export; embed QRDesigner in edit flow and persist `Design` + `QrCode`.
- Presets storage
  - Persist Designer presets (user or tenant scoped) to Mongo.
- Admin pages
  - Analytics admin (global filters) and fallback management.

## Week 5+ — Optional

- Offline verifier app (PWA) for field checks.
- Multi‑tenant billing plans.
- On‑device QR scanning tests for low‑end devices.

## Risks & decisions

- GeoIP: choose MaxMind (local DB) vs. a hosted API; affects redirect latency.
- Redis hosting: local vs. managed (Upstash/Redis Cloud) for analytics.
- Tenant scoping: Week 1 associates QRs to the user; formal tenant onboarding in Week 2–3.

## Changelog (key files)

- Frontend: `components/QRDesigner.jsx`, `components/ui/*`, `pages/_app.js`, `pages/index.js`, `components/NavBar.jsx`, Docker files.
- Designer modules: `components/qr/{ContentTab,StyleTab,CornersTab,LogoTab,PresetsTab}.jsx`.
- Backend: `models/{Tenant,Design,QrCode}.js`, `lib/auth.js`, `pages/api/qr/*`, `pages/studio/qrs.js`.

