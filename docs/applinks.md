# App Links (iOS/Android/Web) — Summary from Reference

This document summarizes the fields, UX, and behaviors inferred from the reference `onlineqrgenerator/app.html` and mapped to our Next.js implementation.

## Purpose

Create a QR that smart‑routes users to the right destination based on device:

- iOS: App Store URL
- Android: Google Play URL
- Others/desktop: Web fallback URL

Optionally show a branded landing with clear CTAs for each platform instead of an immediate redirect.

## User Inputs (Designer)

- iOS App Store URL: `https://apps.apple.com/...`
- Android Play URL: `https://play.google.com/store/apps/details?id=...`
- Web fallback URL: any `https://...`
- Title (display title)
- Description (short paragraph)
- Typography: title font (`tf`), body font (`bf`)
- Theme: primary (`accent`), secondary (`accent2`) colors
- Layout style: `card` (default) or `minimal`
- Optional CTA labels: `ctaIos`, `ctaAndroid`, `ctaWeb` (defaults: “App Store”, “Google Play”, “Open Website”)
- Auto‑redirect toggle: enable immediate device routing when scanning

## Validation Hints

- Accept plain hostnames and normalize to `https://` when missing
- Prefer well‑formed store URLs but do not hard‑validate domains (developer previews often use placeholder links)
- If only one of the three URLs is present, show only that CTA; auto‑redirect uses the first available for the detected device, or falls back to the web URL

## Landing Page (Preview) Route

- Path: `/view/applinks`
- Supported query params:
  - `ios`: iOS App Store URL
  - `android`: Android Play URL
  - `web`: Web fallback URL (alias: `site`)
  - `title`: heading text
  - `desc`: supporting description
  - `tf`: title font family ("System" to inherit)
  - `bf`: body font family ("System" to inherit)
  - `style`: `card` | `minimal`
  - `accent`: primary color hex (e.g., `#3b82f6`)
  - `accent2`: secondary color hex (used in gradients)
  - `ctaIos`, `ctaAndroid`, `ctaWeb`: optional labels for CTAs
  - `auto`: `device` or `1` to enable device auto‑redirect

### Example

```
/view/applinks?ios=https%3A%2F%2Fapps.apple.com%2Fapp%2Fid123456&android=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.example&web=example.com&title=Get%20Our%20App&desc=Fast%20and%20secure%20on%20every%20device.&tf=Inter&bf=Inter&style=card&accent=%232563eb&accent2=%231d4ed8&auto=device
```

## Behavior

- Auto‑redirect: when `auto` enabled, detect platform via user agent and redirect to `ios` / `android`; otherwise fall back to `web`
- Manual CTAs: when not auto‑redirecting (or after), show three buttons aligned to the theme colors
- Normalization: if a URL does not start with `http`, prefix `https://`

## UI Patterns (from reference)

- Colored gradient header with title and description (matches other media previews)
- Clean “card” layout: left content illustration, right summary + CTAs
- “Minimal” layout: single column with title, description, and CTAs
- Consistent padding and rounded cards, subtle borders/shadows

## Mapping to Designer Fields

- ContentTab → App Links
  - iOS App Store URL → `ios`
  - Android Play URL → `android`
  - Web fallback URL → `web`
- Shared presentation (used across previews)
  - Title, Description, Fonts, Colors, Style
  - Optional CTA labels and auto‑redirect toggle

## Notes

- Reference `app.html` includes heavy marketing/analytics scripts; UI patterns align with the step‑2 builder (gradient headers, CTA blocks, mobile‑first spacing)
- We treat device detection pragmatically (iOS via iPhone/iPad/iPod UA, Android via `android`; desktop/others → web)
- Deep links (custom URL schemes or universal links) can be added later; current scope targets store URLs + web fallback

