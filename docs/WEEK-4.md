# Week 4 — UI Polish, Presets, Payments Prep

This week focuses on UI robustness, preset workflows, and preparing for a real payment flow integration. It builds on Weeks 2–3 (redirector + analytics + rules/rotation + micro‑app).

## Implemented (so far)

- Card overflow hardening
  - Components: `components/ui/card.jsx`
  - Changes: added `overflow-hidden` and `min-w-0` to `Card` and regions; `break-words` for titles/descriptions. Prevents text spilling in all cards.
  - Usages updated: `pages/qrs.js`, `pages/studio/qrs.js` now wrap long slugs/titles.

- QRDesigner Style tab layout fixes
  - Switch group wraps on small screens to avoid pushing past card edge.
  - Files: `components/QRDesigner.jsx`, `components/qr/StyleTab.jsx`.

- Presets and Save‑to‑Library layout fixes
  - Grids and button rows now use `w-full` and `flex-wrap` where needed to stay inside cards.
  - Files: `components/QRDesigner.jsx`, `components/qr/PresetsTab.jsx`.

- Background gradient reset bugfix
  - When switching from gradient to transparent or a solid color, old gradient no longer lingers.
  - Implementation: force `gradient: null` in `backgroundOptions` (and dots options for parity) when gradient toggles are off.
  - File: `components/QRDesigner.jsx`.

## Remaining / In Progress

- Cloud presets UX polish (loading states, toasts, validation).
- Micro‑app content blocks (hero + sections) and visual presets.
- Payment flow: replace `pages/api/pay-later/initiate.js` stub with a real PSP session initializer.

## Week 4 Plan (targets)

- Payments
  - Integrate a real provider (Stripe/Adyen/…): create session endpoint, return redirect URL, and a success/cancel landing.
  - Add minimal UI hooks from micro‑app and studio to initiate.

- Designer persistence
  - Auto‑save snapshots while designing; allow naming and restoring snapshots inline.
  - Improve snapshot schema validation server‑side.

- Micro‑app enrichments
  - Theme tokens and presets; optional CTA blocks; shareable preview URL.

- Analytics quality of life
  - Sparkline hover details; CSV export for country/city breakdowns.

## Acceptance

- No card or control overflows at common breakpoints (sm/md/lg).
- Switching background modes (gradient → transparent → solid) reflects immediately in preview and exports.
- Presets save/load both locally and from cloud endpoints without layout issues.
- Payment initiation returns a usable checkout/test URL.

## Notes

- All UI fixes are tailwind‑class only; no breaking API changes.
- Gradient reset relies on the QR library respecting null/undefined `gradient` keys during updates.
