# Roadmap Brief — Status and Next Steps

This brief summarizes what has shipped so far and what remains, based on `docs/ROADMAP.md` and recent changes.

## Delivered

- Week 1
  - UI foundation with shadcn/ui components and global theming/toaster.
  - QR Designer (tabs, responsive preview), NavBar.
  - Models and CRUD APIs for QR codes; basic Studio list.
  - Docker DX for hot reload.

- Week 2 (core parts)
  - Redirector `/r/[slug]` with initial destination logic.
  - Redis logging of scans (total, daily buckets, device/country/city hashes).
  - Analytics summary API and Studio analytics page (now enhanced).

- Week 3
  - Rule engine (time/geo/device), A/B splits, and rotation (TOTP/interval) in resolver.
  - Shared resolver helpers in `lib/resolve`.
  - Micro‑app page `/m/[slug]` with quick actions and details.
  - Pay‑later initiation API stub.

- Week 4 (to date)
  - UI polish and overflow fixes across cards and Designer tabs.
  - Presets: local + cloud storage (model + APIs) integrated into Designer.
  - Admin: global fallback setting UI.
  - Global Nav in `_app`, context‑aware buttons.
  - Analytics page UX: KPIs, period deltas, progress bars, and scrollable chart.
  - Background gradient reset fix in Designer.

## Remaining / In Progress

- Week 2
  - Analytics worker/rollup job (Redis → Mongo) for long‑term storage.

- Week 4
  - Payments: replace pay‑later stub with real PSP (create session, redirect URLs, success/cancel pages).
  - Designer persistence: auto‑save snapshots, inline restore, server‑side validation.
  - Micro‑app enrichments: theme presets, content sections/CTAs, nicer preview.
  - Analytics QoL: sparkline hovers, CSV export from UI for geo/device breakdowns.

## Risks / Decisions

- GeoIP source (local DB vs hosted) affects redirect latency and complexity.
- Redis hosting choice (local vs managed) impacts reliability of analytics.
- Tenant scoping beyond single‑user owner flows.

## Next Actions

1) Implement rollup worker and schedule (or on‑demand backfill) to persist daily aggregates.
2) Integrate a PSP (Stripe preferred for speed) for pay‑later: backend session endpoint + client redirects.
3) Add Designer auto‑save with throttling; expose snapshot history in the UI.
4) Expand micro‑app theming and add optional CTA/content blocks.
5) Add small UI touches to analytics (tooltips, CSV exports).

