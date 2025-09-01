# Pages Reference

This document explains every Next.js page in the app, what it does, how it works, and the key functions used inside each page.

All routes refer to the Pages Router under `pages/`.

## Home — Designer
- Route: `/`
- File: `pages/index.js`
- Auth: Required (redirects unauthenticated users to `/auth/signin`).
- Purpose: Landing page and the QR Designer UI (client‑side component).
- Key Components:
  - `components/QRDesigner.jsx`: Full designer with Tabs (Content, Style, Corners, Logo, Presets), live preview, download and save flows.
  - `components/NavBar.jsx`: Global top bar.
- Notable details:
  - Uses `next/font` for Geist fonts.
  - Server guard via `getServerSideProps` and NextAuth.

## User QRs List
- Route: `/qrs`
- File: `pages/qrs.js`
- Auth: Required (inherits guard by exporting `getServerSideProps` from Home).
- Purpose: Show the authenticated user’s QRs with quick actions.
- UI/Logic:
  - `fetchList()`: GET `/api/qr?q=…&status=active` to list only active items.
  - `openPreview(item) / closePreview()`: Control the preview dialog.
  - `doTestResolve()`: GET `/api/qr/resolve?slug=…` to compute redirect destination.
  - `deleteQr(item)`: DELETE `/api/qr/:id` (archives on server) then removes from client list.
  - Overflow-safe slugs/titles with `break-all`/`truncate`.

## Studio — QRs
- Route: `/studio/qrs`
- File: `pages/studio/qrs/index.js`
- Auth: Required; open to any signed‑in user.
- Purpose: Studio list with create, edit, export actions.
- UI/Logic:
  - `fetchList()`: GET `/api/qr?q=…` (all statuses) for admin‑style management.
  - `createQuick()`: POST `/api/qr` with a default static link and name.
  - Links: Edit → `/studio/qrs/[id]`, Open redirect → `/r/{slug}`.

## Studio — Edit QR
- Route: `/studio/qrs/[id]`
- File: `pages/studio/qrs/[id].js`
- Auth: Required.
- Purpose: Edit QR fields and attached Design snapshot; embedded Designer preview.
- Server side:
  - `getServerSideProps`: Loads QR by `id` and optional `designRef`.
- Client side:
  - `saveAll()`: Upserts Design (POST/PATCH `/api/design`) then PATCH `/api/qr/:id` with updated references and fields.

## Studio — Analytics
- Route: `/studio/analytics`
- File: `pages/studio/analytics/index.js`
- Auth: Required.
- Purpose: Per‑QR analytics dashboard driven by Redis counters.
- Logic:
  - Loads user QRs for the picker with `/api/qr`.
  - `load()`: GET `/api/analytics/summary?slug=…&days=…` (fetches 2× days to compute deltas).
  - Derived metrics: all‑time, last N days total, delta vs previous period, average/day, active days, peak, device/country/city distributions.
  - UI: KPI cards + scrollable bar chart + progress bars for distributions.

## Micro‑app
- Route: `/m/[slug]`
- File: `pages/m/[slug].js`
- Auth: None.
- Purpose: Minimal landing for a QR with quick actions and details; intended for campaign experiences.
- Server side:
  - `getServerSideProps`: Loads QR by `slug`; 404 if missing.
- Client side: Quick actions (open redirect, open studio); shows type and primary URL when available.

## Redirector
- Route: `/r/[slug]`
- File: `pages/r/[slug].js`
- Auth: None.
- Purpose: Compute destination and 302 redirect. Log scan event to Redis (best‑effort).
- Functions:
  - `detectDevice(ua)`: `ios | android | desktop` from UA.
  - `inArrayOrEmpty(value, arr)`: Helper to consider empty lists as wildcards.
  - `matchWhen(when, now)`: Time window match using timezone/day/hour.
  - `chooseAbSplit(abSplits, seedIndex)`: Weighted or seeded pick.
  - `computeDestination(code, headers)`: Rules → rotation → A/B → fallback.
- Server side:
  - `getServerSideProps`: Fetch QR, compute destination, `logScanEvent`, send `redirect`.
  - Uses `lib/settings.getSetting('fallback.redirect')` when QR missing/paused.

## Auth — Sign in
- Route: `/auth/signin`
- File: `pages/auth/signin.js`
- Purpose: Sign‑in page with Google/Facebook/Instagram buttons using NextAuth.
- Behavior:
  - Redirects to `/` if already authenticated (both server and client sides).

## App and Document
- Files: `pages/_app.js`, `pages/_document.js`
- Purpose: Global providers and HTML shell.
- `_app.js`:
  - Wraps with `SessionProvider`, `ThemeProvider`, global `NavBar`, and `Toaster` notifications.
- `_document.js`:
  - Standard custom document for Next.js (no business logic).

# Notes on UI Components on Pages
- `components/ui/card.jsx`: Provides Card primitives with overflow safety and word‑wrapping.
- `components/NavBar.jsx`: Global header; shows context‑aware buttons (hides Designer on `/`, hides My QRs on `/qrs`).

