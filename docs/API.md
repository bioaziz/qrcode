# API Reference

Every API route under `pages/api` is documented below with its purpose, auth, parameters, and behavior. All responses are JSON unless noted.

Conventions
- Auth: Most routes require a NextAuth session via `requireSession` or `getServerSession`.
- Errors: Use HTTP status codes (401, 404, 405, 500) with `{ success: false, message }` payloads.

## Auth

### `GET /api/auth/[...nextauth]`
- File: `pages/api/auth/[...nextauth].js`
- Purpose: NextAuth configuration and handlers for OAuth providers.
- Providers: Google, Facebook, Instagram (client IDs/secrets via env).
- Callbacks:
  - `signIn`: Upserts the user record by email (or provider id if no email).
  - `session`: Hydrates `session.user.id` from DB and normalizes name/image.

## QR Codes

### `GET /api/qr`
- Auth: Required.
- Query params:
  - `q` (string, optional): case‑insensitive search over `slug` or `meta.name`.
  - `status` (string, optional): `active|paused|archived`.
  - `type` (string, optional): e.g. `static|dynamic|wifi|vcard|payLater|ticket`.
  - `limit` (number, default 20), `offset` (number, default 0).
- Response: `{ success, items: QrCode[], total }` (items sorted by `createdAt` desc).

### `POST /api/qr`
- Auth: Required.
- Body: `{ slug?, type?, staticPayload?, dynamicConfig?, primaryUrl?, meta?, name?, designRef? }`.
  - If `slug` absent, generated as random hex.
  - `type` defaults to `static`. `meta.name` defaults to `slug`.
- Response: `{ success, item }` (201 on success).

### `GET /api/qr/:id`
- Auth: Required.
- Returns QR by id, scoped to the authenticated owner.

### `PATCH /api/qr/:id`
- Auth: Required.
- Body: partial update; supports `slug`, `type`, `staticPayload`, `dynamicConfig`, `status`, `meta`, `designRef`.
- Response: `{ success, item }`.

### `DELETE /api/qr/:id`
- Auth: Required.
- Behavior: Soft‑delete — sets `status="archived"` and saves.
- Response: `{ success, item }`.

### `GET /api/qr/export?format=json|csv`
- Auth: Required.
- Purpose: Export the user’s QRs.
- Behavior:
  - JSON: downloads JSON array.
  - CSV: downloads CSV with headers `_id,slug,type,name,createdAt`.

### `GET /api/qr/resolve?slug=...`
- Auth: None.
- Purpose: Resolve destination for a slug via the same logic used by the redirector (without redirecting).
- Response: `{ success, destination }`.

## Analytics

### `GET /api/analytics/summary?slug=...&days=N`
- File: `pages/api/analytics/summary.js`
- Auth: None (reads aggregate counters only; no sensitive data).
- Purpose: Read scan counters from Redis.
- Response: `{ success, data: { total, daily[{ day, count }], devices{}, countries{}, cities{} } }`.
- Implementation: `lib/redis.getSummary()` fetches total, last N days by daily keys, and hash maps for distributions.

### `POST /api/analytics/rollup` (stub)
- File: `pages/api/analytics/rollup.js`
- Purpose: Placeholder for future background rollups; no behavior yet.

## Design Snapshots

### `POST /api/design`
- Auth: Required.
- Body: Full snapshot from the Designer (options for dots/background/gradients/corners/etc.).
- Behavior: Creates and returns a `Design` document.

### `GET /api/design/:id`
- Auth: Required.
- Returns a stored design snapshot.

### `PATCH /api/design/:id`
- Auth: Required.
- Behavior: Updates the existing design document with provided fields.

## Presets (Cloud)

### `GET /api/presets`
- Auth: Required.
- Returns the current user’s cloud presets (up to 100).

### `POST /api/presets`
- Auth: Required.
- Body: `{ name, snapshot }` (snapshot from Designer).
- Response: `{ success, item }` (201 on success).

### `GET /api/presets/:id`
- Auth: Required.
- Returns the preset by id for the current user.

### `DELETE /api/presets/:id`
- Auth: Required.
- Deletes the preset document.

## Admin Settings

### `POST /api/admin/settings`
- Auth: Admin only (checked via `getServerSession` + `isAdminEmail`).
- Body: `{ key, value }`.
- Behavior: Upserts a `Setting` record. Used for `fallback.redirect` consumed by `/r/[slug]`.

## Payments (Stub)

### `POST /api/pay-later/initiate?slug=...`
- Auth: None.
- Purpose: Returns a dummy URL for a pay‑later session (to be replaced in Week 4).
- Response: `{ success, url }`.

# Helper Libraries (used by API/pages)

## `lib/redis.js`
- `hasRedis()`: Boolean.
- `logScanEvent({ slug, qrId, country, city, device })`: Pipelined counters; best‑effort.
- `getSummary({ slug, days })`: Returns totals, daily array, and distributions from Redis keys/hashes.

## `lib/resolve.js`
- `detectDevice(userAgent)`: Returns `ios|android|desktop`.
- `matchWhen(when, now)`: Time window checks (tz/day/hour).
- `chooseAbSplit(abSplits, seedIndex?)`: Weighted or deterministic pick.
- `computeDestination(code, headers)`: Rules → rotation → A/B → fallback.

## `lib/settings.js`
- `getSetting(key, fallback?)`: Reads a key from `Setting` collection; used for fallback redirects.

## `lib/auth.js`
- `requireSession(req, res)`: Returns NextAuth session or sends 401; used by most authenticated APIs.

