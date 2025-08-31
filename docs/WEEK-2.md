# Week 2 Update — Redirector, Logging, Analytics

This document explains the Week 2 changes in detail: the redirector route for public scans, Redis-based event logging, a lightweight analytics API, and a simple analytics UI in the Studio.

## Overview

- Added a redirector route at `/r/[slug]` that looks up a QR by its slug and issues a 302 to the destination.
- Logged each scan (best-effort, non-blocking) into Redis for fast counters and simple breakdowns.
- Exposed an analytics summary API that reads aggregates from Redis.
- Built a minimal analytics page in the Studio to visualize totals, a 14-day sparkline, and device share.
- Kept all logic resilient: if Redis is not configured, scanning still works and analytics return zeros.

## What’s Included

- Redirector route
  - File: `pages/r/[slug].js`
  - Behavior:
    - Finds a `QrCode` by `slug` and checks `status === "active"`.
    - Destination selection (initial):
      - `type = "static"` → use `staticPayload`.
      - `type = "dynamic"` → use `dynamicConfig.primaryUrl`.
      - Other types → fallback to `staticPayload` or `dynamicConfig.primaryUrl` if present.
    - Sends HTTP 302 to the destination with `Cache-Control` disabled.
    - Logs a scan event with `slug`, `qrId`, `country`, `city`, `device` (fire-and-forget).
  - Device detection: simple UA parsing → `ios | android | desktop`.
  - Geo hints: read from common headers if present (e.g., `x-vercel-ip-country`, `cf-ipcountry`). No IP lookups here.

- Redis integration (optional)
  - File: `lib/redis.js`
  - Creates an `ioredis` client if `REDIS_URL` is set and the dep is installed. Otherwise functions are no-ops.
  - `logScanEvent({ slug, qrId, country, city, device })` increments keys:
    - `qr:slug:{slug}:hits` — total scans (integer)
    - `qr:slug:{slug}:hits:{YYYYMMDD}` — daily scans (integer)
    - `qr:slug:{slug}:device` — hash: `{ ios: n, android: n, desktop: n, … }`
    - `qr:slug:{slug}:country` — hash: country distribution
    - `qr:slug:{slug}:city` — hash: city distribution
    - `qr:slug:{slug}:meta` — hash: stores `qrId` (string)
  - `getSummary({ slug, days })` returns an object of counters for dashboards.
  - Helper: `hasRedis()` to detect availability.

- Analytics API
  - `GET /api/analytics/summary?slug={slug}&days=14`
  - File: `pages/api/analytics/summary.js`
  - Returns `{ success, data: { total, daily[], devices{}, countries{}, cities{} } }`.
  - Includes a lightweight worker stub: `pages/api/analytics/rollup.js` (for future Redis→Mongo rollups; no-op for now).

- Analytics Studio page
  - File: `pages/studio/analytics.js`
  - Input a slug → shows totals, device breakdown, and a 14-day bar chart.
  - Guarded via the same `getServerSideProps` session protection as the Designer.

## How to Configure & Run

- Install dependency: `ioredis` (added to `package.json`).
- Set environment variable `REDIS_URL` to your Redis instance.
  - Works with standard Redis URLs (e.g., `redis://user:pass@host:port/0`).
  - If `REDIS_URL` is not set or client fails to init, logging is skipped safely.
- Start normally (local): `npm run dev` → http://localhost:3000
- Start with Docker: `docker compose up --build` → http://localhost:3008

## Testing the Flow

1) Create a QR (Week 1 endpoint):
- POST `http://localhost:3008/api/qr` with JSON: `{ "type": "static", "staticPayload": "https://example.com", "meta": { "name": "Test" } }`.
- Note the `slug` in the response (or set your own when creating).

2) Scan via redirector:
- Open `http://localhost:3008/r/{slug}` in a browser. You should be redirected to `https://example.com`.
- Repeat a couple of times to increment counters.

3) View analytics:
- Navigate to `http://localhost:3008/studio/analytics`.
- Enter `{slug}` and click `Load`.
- You should see totals, bars for recent days, and device stats.

4) Inspect Redis keys (optional):
- Example keys written: `qr:slug:{slug}:hits`, `qr:slug:{slug}:hits:YYYYMMDD`, `qr:slug:{slug}:{device|country|city}`.

## Security & Privacy

- The redirector does no complex processing of user input; it looks up existing `QrCode` docs by `slug` and returns 302.
- Logging stores aggregate counters and the `qrId` reference. No PII (e.g., IP) is stored here.
- Geo is derived from edge headers if present; you can plug a GeoIP service in Week 3 if needed.

## Performance Considerations

- Logging uses a Redis pipeline; it is best-effort and does not block the redirect.
- If Redis is slow or unavailable, the request still redirects successfully.
- The redirect page disables caching via `Cache-Control` headers.

## Known Limitations (addressed in Week 3)

- No rule engine yet: time-based, geo-based, device filtering, A/B splits, and rotations are not applied here.
- No rollup job yet: raw counters live in Redis; rollups into Mongo will be implemented for long-term analytics.
- Minimal analytics UI: shows only totals, a recent trend, and device share.

## Code Map

- Redirector: `pages/r/[slug].js`
- Redis helpers: `lib/redis.js`
- Analytics API: `pages/api/analytics/summary.js`, `pages/api/analytics/rollup.js`
- Analytics UI: `pages/studio/analytics.js`

## Next (Week 3 Preview)

- Implement rule evaluation and destination selection (time/geo/device, A/B split, rotation).
- Add cron/worker to aggregate Redis counters into Mongo daily rollups.
- Expand analytics views: country/city charts, per-device trends, per-QR filters.
