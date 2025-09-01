# Dynamic vs Static QR Codes

This document explains what dynamic QR codes are, how they differ from static QR codes, and how this platform implements and supports them.

## What Is A Dynamic QR?

A dynamic QR encodes a short, stable URL (a slug) that resolves to a destination at scan time. The destination can be changed without reprinting the QR, and advanced routing logic can choose different destinations based on context (time, device, geography, A/B tests, rotations, etc.).

On this platform, the dynamic QR URL looks like `/r/{slug}`. The resolver inspects request headers and your QR configuration to decide where to send the user, then issues an HTTP redirect.

## Dynamic vs Static: Key Differences

- Editability: Static embeds content directly (e.g., a long URL, text, Wi‑Fi config) and cannot be changed after printing. Dynamic points to a redirector, so you can update or switch destinations anytime.
- Targeting: Static always opens the same payload. Dynamic can route by device, time window, country/city, random/weighted split, or scheduled rotation.
- Analytics: Static offers no server‑side insight. Dynamic runs through `/r/{slug}`, enabling scan logging and analytics.
- Reliability & size: Static with long URLs produces denser codes. Dynamic uses short slugs, generating smaller, easier‑to‑scan codes and letting you move the actual URL behind the scenes.
- Use cases: Static fits unchanging data (e.g., Wi‑Fi SSID). Dynamic fits campaigns, rotating promos, per‑device app links, and experiments.

## How The Platform Supports Dynamic QRs

### Data Model

- File: `models/QrCode.js`
- Fields:
  - `type`: `"static" | "dynamic" | ...`.
  - `staticPayload`: the embedded content for static QRs.
  - `dynamicConfig`: settings for dynamic routing:
    - `primaryUrl`: default destination for dynamic QRs.
    - `rules[]`: first‑match rules with `when` (tz, dayOfWeek, hours), `geo` (country, city), `device` (ios|android|desktop), and `url`.
    - `abSplits[]`: A/B candidates with `ratio` and `url`.
    - `rotation`: `{ mode: 'totp'|'interval', stepSec?, intervalMin?, maxScans? }` used with `abSplits` to deterministically rotate destinations.
    - `fallbacks`: present in schema (offlineUrl/ussd/sms), currently not applied in the redirect flow.

### Redirect Flow

- User scans a QR that encodes `https://your-domain/r/{slug}`.
- File: `pages/r/[slug].js`
  - Loads the QR by `slug`, ensures `status === 'active'`.
  - Resolves destination via compute logic (same as `lib/resolve.js`).
  - Logs a scan event to Redis (`lib/redis.logScanEvent`) with device/country/city.
  - Redirects to the chosen destination.
- Global fallback: if a slug is missing or archived/paused, redirects to `fallback.redirect` from settings (`lib/settings.getSetting`).

### Resolution Logic

- Files: `lib/resolve.js` and mirrored in `pages/r/[slug].js`.
- Order of evaluation:
  1. Rules: first rule that matches `when` (timezone/day/hour), `geo` (country/city), and `device` wins.
  2. Rotation: if `rotation.mode` is set and `abSplits` exist, deterministically pick a URL for the current time bucket.
  3. A/B split: weighted random pick from `abSplits` when no rule/rotation applies.
  4. Fallback by type: `staticPayload` for `type="static"`, `dynamicConfig.primaryUrl` for `type="dynamic"`, else first available.
- Helpers:
  - `detectDevice(userAgent) → ios|android|desktop`.
  - `matchWhen(when, now)` with timezone support using `Intl.DateTimeFormat`.
  - `chooseAbSplit(abSplits, seedIndex?)` for weighted or deterministic choice.

### Analytics

- Scan logging: `logScanEvent({ slug, qrId, country, city, device })` in `lib/redis.js`.
- Summary API: `GET /api/analytics/summary?slug=...&days=N`.
- Studio UI: `pages/studio/analytics` renders totals, daily trends, and distributions (devices, countries, cities).

### Creating And Managing Dynamic QRs

- Studio UI
  - Create a QR from the Designer (saves as `type: 'static'` by default), then edit it in `pages/studio/qrs/[id].js`.
  - Change `type` to `"dynamic"` and set `Dynamic primaryUrl`. Additional `rules`, `abSplits`, and `rotation` can be managed via API today and surfaced in the UI as needed.
- API
  - Create: `POST /api/qr` with `{ type: 'dynamic', dynamicConfig: { primaryUrl: 'https://...' } }`.
  - Update: `PATCH /api/qr/:id` with partial updates to `dynamicConfig`, `type`, or `status`.
  - Test resolution (no redirect): `GET /api/qr/resolve?slug={slug}`.

### Static QRs On The Platform

- For static QRs the QR image encodes the entire payload (e.g., URL/text). Editing the document won’t change already printed codes.
- Creation in Designer stores `type: 'static'` with `staticPayload` set from the content tab.
- The “Preview” in My QRs shows a QR encoding `/r/{slug}` for convenience when sharing through the platform, but static QRs remain valid if you export the image and use it directly.

## Examples

### Dynamic QR (API request)

```json
POST /api/qr
{
  "type": "dynamic",
  "dynamicConfig": {
    "primaryUrl": "https://example.com/summer-campaign",
    "rules": [
      { "device": "ios", "url": "https://apps.apple.com/app/id123" },
      { "device": "android", "url": "https://play.google.com/store/apps/details?id=com.example" }
    ],
    "abSplits": [
      { "name": "A", "ratio": 0.5, "url": "https://example.com/landing-a" },
      { "name": "B", "ratio": 0.5, "url": "https://example.com/landing-b" }
    ],
    "rotation": { "mode": "interval", "intervalMin": 60 }
  },
  "meta": { "name": "Summer Campaign QR" }
}
```

### Resolution Test

- `GET /api/qr/resolve?slug={slug}` → `{ success: true, destination: "https://..." }`.

## Best Practices

- Keep slugs short for compact QR modules and easier scanning.
- Prefer dynamic QRs for anything you might need to update or measure.
- Use rules for deterministic targeting (device, time, geo). Use A/B with rotation for controlled experiments.
- Configure a global fallback URL in Studio Admin → Fallbacks for resilient behavior when a QR is paused/archived.

## File Pointers

- Model: `models/QrCode.js`
- Resolver library: `lib/resolve.js`
- Redirect page: `pages/r/[slug].js`
- Resolve API: `pages/api/qr/resolve.js`
- QR CRUD APIs: `pages/api/qr/index.js`, `pages/api/qr/[id].js`
- Analytics: `lib/redis.js`, `pages/api/analytics/*`, `pages/studio/analytics`
- Studio editor: `pages/studio/qrs/[id].js`

