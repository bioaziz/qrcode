# Online QR Generator Integration Plan

## Objectives

- Incorporate key features and UX patterns from `onlineqrgenerator` into this Next.js app.
- Expand supported QR types, add curated design presets, and improve export/download UX.
- Align marketing/landing pages for specific QR use cases and strengthen analytics visibility.

## Current State (Quick Map)

- Next.js app with authenticated designer at `pages/designer.js` using `components/QRDesigner.jsx`.
- Styling controls via tabs in `components/qr/` (ContentTab, StyleTab, CornersTab, BorderTab, LogoTab, PresetsTab).
- Dynamic redirector at `pages/r/[slug].js` with rules, A/B, rotation, geo/device/time matching.
- Models: `models/QrCode.js` (types: static, dynamic, wifi, vcard, etc.), `models/AnalyticsDaily.js`.
- Analytics UI at `pages/studio/analytics/` and Redis logging via `@/lib/redis`.
- Local folder `onlineqrgenerator/` contains reference HTML pages: home, designqrcode-1/2, “Design your QR code”, and per-type pages (wifi, vcard, website, whatsapp, socialmedia, pdf, image, mp3, video, menu-1..4, listoflink, business, coupon, app, analytics, faq, myqrs, docwloadqr).

## Feature Inventory from Reference HTML

- QR content types: website/link, wifi, vcard, mecard, email, phone, whatsapp, social profiles/aggregator, media (pdf, image, mp3, video), app deep links, menus/link-lists, business/coupon landing micro-pages.
- Designer UX: curated style presets, color gradients, corner styles, logo overlay, border/ring text.
- Download/export: user-facing “download QR” flow; often PNG/SVG/PDF options.
- Analytics: scan counts, time trends, geo/device breakdowns, per-QR view; export.
- Marketing: per-type landing pages with benefits and CTA to open preconfigured designer.

## Gap Analysis (vs current app)

- Content presets missing/limited: no whatsapp, sms, social profile bundle, media helpers, app links, link-list/menu.
- Templates: presets exist but can be expanded to match curated sets from reference.
- Download/export: copy supported; explicit PNG/SVG/PDF export UX needs to be surfaced/improved.
- Marketing pages per type: not present; single landing only.
- Micro-landing pages (menus, lists, coupons) not yet scaffolded.

## Step-by-Step Implementation Plan

1) Add Content Presets (designer)
- Extend `components/qr/ContentTab.jsx` and `components/QRDesigner.jsx` to support:
  - `whatsapp` (wa.me with optional prefilled text)
  - `sms` (sms: number with body)
  - `social` (aggregate with a hosted link-list; see step 4)
  - `media` helpers: pdf/image/mp3/video as simple links with file upload optional; initially URL-based
  - `app` links: iOS/Android store links and optional device routing
  - `geo` (geo:lat,long) and `maps` (https url) if useful
- Add validation and i18n strings under `public/locales/*/common.json`.
- Allow preselecting preset via `?mode=` query to `/designer`.

2) Expand Design Presets
- Update `components/qr/PresetsTab.jsx` with curated presets inspired by `designqrcode-*.html`:
  - dot types, corner types, gradients, logo examples, border ring styles
- Add a small set of accessible color palettes; persist last-used preset in local storage.

3) Download/Export UX
- Add explicit buttons in `QRDesigner` to export:
  - PNG (transparent and solid backgrounds)
  - SVG (vector)
  - PDF (A4 letterhead with margins) using a lightweight client lib (or canvas → PDF fallback)
- Provide size controls and filename suggestions; add “Quick copy PNG” remains.

4) Micro-Landing Templates (hosted pages)
- Create simple, fast-rendering templates under `pages/m/`:
  - `pages/m/links/[id].js` — Link-list/social aggregator (title, avatar, social buttons)
  - `pages/m/menu/[id].js` — Menu layouts (menu-1..4 references) using JSON model
  - `pages/m/coupon/[id].js` — Coupon with terms, CTA, expiry
  - `pages/m/business/[id].js` — Business profile card
- Create lightweight models/APIs for template payloads (Mongo): `models/MicroPage.js`, CRUD under `pages/api/micro/*`.
- In `QRDesigner`, add a preset that creates a micro-page and sets the QR to dynamic redirect to that page URL (`/m/...`).

5) Per-Type Marketing Pages
- Add marketing pages with SEO for top types, each linking to `/designer?mode=...`:
  - `pages/types/website.js`, `wifi.js`, `vcard.js`, `whatsapp.js`, `menu.js`, `links.js`, `coupon.js`, `app.js`, `pdf.js`, `image.js`, `mp3.js`, `video.js`.
- Keep template minimal, reuse existing layout/components; content can be iterated later.

6) Dynamic Routing Enhancements
- Extend `models/QrCode.js` enum if needed for new category tags (non-breaking; dynamic remains primary for hosted pages).
- In `pages/r/[slug].js`, preserve current behavior; optionally add per-type fallbacks (e.g., whatsapp/sms offline hints) via `dynamicConfig.fallbacks`.

7) Analytics Polish
- Ensure `pages/studio/analytics/` shows:
  - Total scans, daily trend, device/country/city breakdowns (already present)
  - Add referrer aggregation if available; add CSV export links (API endpoints exist)
- Add quick link to analytics from QR detail cards (already partially wired).

8) i18n and Copy
- Add translation keys for new presets, fields, export buttons, and marketing pages.
- Keep EN baseline; add FR keys to match current app tone.

9) Navigation and CTA Wiring
- Update main landing (`pages/index.js`) to surface popular types and deep links to `/designer?mode=...` and type pages.
- Add a “Create” hub page listing all types (maps to `home.html` reference).

10) QA and Rollout
- Manual test matrix: all presets render and validate, exports work, redirects resolve, micro-pages load, analytics counts increment.
- Document any environment variables (e.g., Redis) and optional file hosting for media URLs.

## Acceptance Criteria

- Designer supports new presets (whatsapp, sms, social/link-list, media helpers, app links, geo/maps) with valid payload generation.
- Export buttons allow PNG/SVG/PDF with correct sizing and background options.
- At least two micro-landing templates (links and menu) are available and reachable via generated dynamic QRs.
- Per-type marketing pages exist and deep-link into the designer with preselected modes.
- Analytics page reflects scan data; CSV exports functional.

## Notes and Considerations

- File uploads for media can be deferred; start with external URLs. If needed, add an S3-compatible backend later.
- Keep changes incremental and behind feature flags where possible.
- Maintain current auth gating for `/designer` and `/studio/*`; marketing pages remain public.

📋 Update plan [░░░░░░░░░░] 0/12
note
Based on the current code and the integration plan, these are the concrete next steps to complete parity with the reference and polish UX
end-to-end.
  └ □ Complete WhatsApp and SMS presets
    □ Add App Links preset (iOS/Android)
    □ Implement Social Link‑list micro‑page
    □ Implement Menu micro‑page templates
    □ Add Coupon/Business micro‑pages (optional)
    □ Preview builders for remaining types
    □ Expand curated design presets
    □ Improve export UX (PNG/SVG/PDF)
    □ Add type marketing pages + deep links
    □ Analytics polish + CSV exports
    □ Add i18n keys for new UI
    □ QA matrix + docs updates

codex
Here’s what remains and a focused plan to finish integration, based on the code and the integration plan.

What’s done

- Media presets: PDF, Image, MP3, Video editors plus /view pages, including password gates and social link cards for MP3/Video.
- Upload APIs: PDF, Image, MP3, Video.
- Live preview builders for pdf/link/image/mp3/video with auto-sync.

Key gaps

- Presets: WhatsApp/SMS completeness, App links (iOS/Android), a true Social/Link-list mode.
- Micro-pages: Link-list, Menu layouts, Coupon/Business templates with models + CRUD + dynamic redirect wiring.
- Design presets: Curated presets/palettes inspired by reference pages.
- Export UX: Dedicated PNG/SVG/PDF export controls and sizes, filename presets.
- Marketing pages: Per-type landing with deep links to /designer?mode=....
- Analytics: CSV export, referrer breakdowns, quick links in QR lists.
- i18n: New keys for added fields/buttons/presets.
- QA & docs: Test matrix and brief docs for env/config.

I’ve posted a concrete next-step plan in the TODOs. Highlights:

- Complete WhatsApp and SMS presets
- Add App Links preset (iOS/Android)
- Implement Social Link‑list micro‑page
- Implement Menu micro‑page templates
- Add Coupon/Business micro‑pages (optional)
- Preview builders for remaining types
- Expand curated design presets
- Improve export UX (PNG/SVG/PDF)
- Add type marketing pages + deep links
- Analytics polish + CSV exports
- Add i18n keys for new UI
- QA matrix + docs updates

Suggested sequence

- Week 1: Finish presets (WhatsApp/SMS/App Links), add Social Link-list micro-page, expand presets/palettes.
- Week 2: Menu + Coupon micro-pages, export UX, type marketing pages.
- Week 3: Analytics polish + CSV, i18n, QA/documentation.

