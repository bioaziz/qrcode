# QR Code Generator

Simple, privacy-friendly QR code generator that runs entirely in your browser. Create QR codes for URLs, text, and more. Optionally overlay a logo and download as PNG.

## Features

- Text/URL input with live preview
- Size control (128–1024 px)
- Error correction levels (L/M/Q/H)
- Foreground/background color
- Optional centered logo overlay with white padding
- Download as PNG

## Usage

1. Open `index.html` in your browser (double-click or drag into a tab).
2. Type a URL or any text.
3. Adjust size, colors, and error correction if desired.
4. Optionally choose a logo (PNG/JPG/SVG). It is previewed and applied on export.
5. Click "Download PNG" to save the generated code.

No data is sent to a server; everything happens locally in your browser.

## Notes

- This app uses the lightweight `qrcodejs` library from a CDN. If you are offline or behind a firewall, the UI will show a message that the library could not load.
- When adding a logo, prefer a simple square logo for best scanning reliability. Larger logos cover more modules and can reduce readability — consider using higher error correction (Q or H) if adding a logo.

## Development

Just edit the files and refresh the browser. No build step is required.


## Translations

Populate French translation files from the English originals using the Google
Translate API. Set `GOOGLE_TRANSLATE_API_KEY` in `.env.local` and run:

```
node scripts/generate-translations.js
```

This reads `public/locales/en/*.json` and writes any missing keys to the
matching `public/locales/fr/*.json` files while preserving existing entries.


## Auth Setup (NextAuth)

Local development is configured on port `3008`.

Environment variables (in `.env`):
- `NEXTAUTH_URL=http://localhost:3008`
- `NEXTAUTH_SECRET=...` (strong random string)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET`
- `INSTAGRAM_CLIENT_ID` / `INSTAGRAM_CLIENT_SECRET`
- `MONGODB_URI=mongodb://localhost:27020/qrcode`
- `NEXTAUTH_DEBUG=true` (optional, for verbose logs)

Provider redirect URIs
- Google
  - Authorized redirect URI: `http://localhost:3008/api/auth/callback/google`
  - Authorized JavaScript origin: `http://localhost:3008`
- Facebook
  - Valid OAuth Redirect URIs: `http://localhost:3008/api/auth/callback/facebook`
- Instagram (Basic Display)
  - Valid OAuth Redirect URIs: `http://localhost:3008/api/auth/callback/instagram`

Run with Docker
1. Fill `.env` as above.
2. `docker compose up --build`
3. App available at `http://localhost:3008`

Troubleshooting
- Redirect URI mismatch: ensure exact match with provider console (including port).
- Use an incognito window or clear cookies if flows get stuck.
- Enable `NEXTAUTH_DEBUG=true` to see detailed NextAuth logs.

## Documentation

- Pages reference: `docs/PAGES.md`
- API reference: `docs/API.md`
- Weekly updates: `docs/WEEK-2.md`, `docs/WEEK-3.md`, `docs/WEEK-4.md`
- Roadmap: `docs/ROADMAP.md`

## How To Explore

- Run locally: `npm run dev` (or `docker compose up --build` for port `3008`).
- Designer (home): `http://localhost:3000/` or `http://localhost:3008/`.
- My QRs: `http://localhost:3000/qrs` — create, preview, open, delete.
- Studio QRs: `http://localhost:3000/studio/qrs` — manage and edit QRs.
- Analytics: `http://localhost:3000/studio/analytics?slug=<your-slug>` — insights and charts.
- Micro‑app: `http://localhost:3000/m/<your-slug>` — lightweight landing per QR.
