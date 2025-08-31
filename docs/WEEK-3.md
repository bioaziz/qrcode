Week 3 Update — Rules, Rotation, Micro‑App, Pay‑Later Stub
=========================================================

This week adds a rule‑driven redirector, rotation/A‑B logic, a micro‑app scaffold for campaigns, and a pay‑later initiation stub. It builds directly on Week 2 analytics (Redis logging) and Week 1 models/API.

Overview
--------

- Router understands time/geo/device rules, A/B splits, and rotation buckets.
- A small “micro‑app” UI exists for each QR (nice landing + actions).
- A pay‑later API stub is in place to be swapped for a real PSP in Week 4.

What Shipped
------------

1) Redirector logic (rules + rotation + A/B)
- File: `pages/r/[slug].js`
- The destination is chosen by `computeDestination(code, headers)` with this order:
  1. First matching rule wins:
     - Time (tz/dayOfWeek/hours) via `matchWhen(when, now)` (timezone aware through `Intl.DateTimeFormat`).
     - Geo (country/city) from edge/CDN headers when available.
     - Device (`ios|android|desktop`) via `detectDevice(userAgent)`.
  2. Rotation: if configured, pick deterministic variant from `dynamicConfig.abSplits` by time bucket:
     - `totp` → bucket = now / `stepSec`
     - `interval` → bucket = now / (`intervalMin` * 60)
  3. Weighted A/B split (if no rotation match).
  4. Fallback: `staticPayload` (type=static) or `dynamicConfig.primaryUrl` (type=dynamic).
- Redis logging from Week 2 still executes non‑blocking after selection.

2) Shared resolver helpers
- File: `lib/resolve.js`
- Exposes `detectDevice`, `matchWhen`, `chooseAbSplit`, `computeDestination` so the router and tools (like preview) remain consistent.

3) Micro‑app scaffold
- File: `pages/m/[slug].js`
- Data: SSR fetch of `QrCode` by slug.
- UX: lightweight landing with a soft gradient hero, quick action buttons (Open Destination, Open Studio), and a Details card.
- Purpose: an owned landing surface per QR for campaigns / “instant apps”.

4) Pay‑later initiation API (stub)
- File: `pages/api/pay-later/initiate.js`
- POST → returns a dummy session URL (placeholder to integrate with Stripe/Adyen/PayLater partner in Week 4).

5) Preview improvements (in the user QR list)
- File: `pages/qrs.js`
- Mini QR rendering with `components/QRMini.jsx` for the redirect URL.
- “Test resolve” button calls `GET /api/qr/resolve?slug=...` to show the computed destination.
- Helper API: `pages/api/qr/resolve.js` uses `lib/resolve.computeDestination` server‑side.

Data Model (recap)
------------------

`models/QrCode.js → dynamicConfig` fields used by the redirector:
- `primaryUrl`: base destination for `type="dynamic"`.
- `abSplits[]`: array of `{ name, ratio(0..1), url }`.
- `rules[]`: `{ when{ tz, dayOfWeek[], hours[] }, geo{ country[], city[] }, device, url }`.
- `rotation`: `{ mode: "totp"|"interval", stepSec, intervalMin, maxScans }`.

How the Router Chooses a URL (pseudo)
-------------------------------------

```
if (rule matches time && geo && device) return rule.url
if (rotation configured) return abSplits[bucket(now)]
if (abSplits present) return weightedPick(abSplits)
return fallback(staticPayload or primaryUrl)
```

Testing Guide
-------------

1) Create a dynamic QR (Week 1 API):
- POST `/api/qr` with `{ type: "dynamic", dynamicConfig: { primaryUrl: "https://example.com", abSplits: [...], rules: [...], rotation: {...} } }`.

2) Hit the redirector: `/r/{slug}`
- Try different times (change your local time), devices, or add mock headers to simulate geo.
- Observe you are routed based on your config.

3) Live preview: `/qrs`
- Click “Preview”, scan the mini QR, or click “Test resolve” to see the computed destination.

4) Micro‑app: `/m/{slug}`
- Use quick actions and confirm details render.

5) Analytics still work
- `/studio/analytics?slug={slug}` shows totals and daily bars built in Week 2.

Deployment Notes
----------------

- No breaking schema changes; Week 1 models already include fields used by rules/rotation.
- Redirector continues to log to Redis (requires `REDIS_URL` as in Week 2).
- Micro‑app and preview pages are SSR + client‑safe.

Security & Privacy
------------------

- Router evaluates rules against request headers; no IP stored.
- Analytics logging tracks aggregate counters; no PII is persisted by these changes.

What’s Next (Week 4)
--------------------

- Replace pay‑later stub with a real PSP session/init flow.
- Persist Designer snapshots automatically from the UI and wire editing flows end‑to‑end.
- Expand micro‑app (content sections, theming) and Studio export flows.

Code Map
--------

- Router: `pages/r/[slug].js`
- Resolver helpers: `lib/resolve.js`
- Micro‑app: `pages/m/[slug].js`
- Pay‑later API: `pages/api/pay-later/initiate.js`
- Preview (mini QR + resolve): `components/QRMini.jsx`, `pages/qrs.js`, `pages/api/qr/resolve.js`
