# Micro‑app and Studio Overview

This document explains the purpose of the Micro‑app page and the Studio, how they relate to QR codes, redirects, analytics, and (future) payments.

## Micro‑app (`/m/[slug]`)

- Purpose: Lightweight landing page for a specific QR code that surfaces quick actions and context without leaving the product ecosystem.
- Route/File: `/m/[slug]` — `pages/m/[slug].js`.
- What it shows:
  - Quick actions: open computed destination (`/r/[slug]`), go to Studio, start pay‑later flow (stubbed).
  - Details: slug, type, and primary URL for dynamic codes.
- How it’s relevant:
  - Campaign hub: Use it as a simple per‑QR campaign page when a full website is unnecessary.
  - Payment entry: Hosts a “Start Pay‑Later” button wired to `POST /api/pay-later/initiate?slug=...` (to be replaced with real PSP).
  - Debugging: Fast way to inspect a QR’s destination and metadata without switching contexts.
- Data flow:
  - Server loads the QR by slug via Mongo (`getServerSideProps`).
  - Buttons link to the redirector (`/r/[slug]`) which computes destination and logs analytics.
- Future enhancements (Week 4+):
  - Theming presets, optional content sections/CTAs, and richer previews.

## Redirector (context)

- Route/File: `/r/[slug]` — `pages/r/[slug].js`.
- Purpose: Compute and 302‑redirect to the selected destination using rule/device/geo/rotation logic, then log scan metrics to Redis.
- Relation to Micro‑app: The Micro‑app’s “Open Destination” button delegates to the redirector, keeping analytics consistent.

## Studio (`/studio/*`)

- Purpose: Owner/admin workspace to create, manage, and analyze QR codes.
- Key pages:
  - `/studio/qrs` — list, create, edit, and open individual QRs (mini preview + test resolve).
  - `/studio/analytics` — per‑slug analytics dashboard powered by Redis counters (totals, 14‑day bars, device/country/city).
  - `/studio/admin/fallbacks` — admin‑only global fallback destination used when a QR is missing/paused.
- Why it matters:
  - Centralizes operational tasks: creation, updates, quick links to redirect/micro‑app.
  - Insight loop: Analytics page reads from Redis to show scan trends and distributions; supports CSV export for devices/countries/cities.
  - Governance: Admin settings (e.g., fallback redirect) affect redirector behavior in edge cases.
- Data flow highlights:
  - CRUD via `pages/api/qr/*` with Mongo models (`models/QrCode`, `models/Design`).
  - Analytics via `GET /api/analytics/summary` and CSV export via `GET /api/analytics/export`.
  - Background rollups via `POST /api/analytics/rollup` persist daily totals to Mongo (`models/AnalyticsDaily`).

## Typical Flows

- Create → Test → Launch:
  1) Create/edit in Studio `/studio/qrs`.
  2) Open Micro‑app `/m/[slug]` to check context and actions.
  3) Use redirector link `/r/[slug]` for live destination and logging.
  4) Monitor `/studio/analytics?slug=...` for scans and distributions; export CSV if needed.

- Troubleshooting a QR:
  - Use Studio “Test resolve” and Micro‑app “Open Destination”. If paused/missing, redirector applies the admin fallback.

## Files & Routes (quick map)

- Micro‑app: `pages/m/[slug].js`
- Studio QRs: `pages/studio/qrs.js` (+ `pages/studio/qrs/[id].js`)
- Studio Analytics: `pages/studio/analytics/index.js`
- Admin Fallbacks: `pages/studio/admin/fallbacks.js`
- Redirector: `pages/r/[slug].js`
- Analytics APIs: `pages/api/analytics/{summary,export,rollup}.js`
- Payments (stub): `pages/api/pay-later/initiate.js`

