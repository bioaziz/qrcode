# Codex Agent Guide

Authoritative guide for working on this repository with a Codex-style AI coding agent. It captures project context, workflow expectations, and ready-to-use templates so the agent can execute tasks confidently and surgically.

## 1) Project Snapshot
- Stack: Next.js 15 + React 19 (pages/ router), Tailwind CSS v4, Radix UI, next-themes, next-i18next, SWR.
- QR tooling: `qrcode`, `qr-code-styling`, `qrcode-generator`, `jspdf`, `sharp`.
- Backend bits: API routes under `pages/api/**`, optional Redis (`ioredis`) and Mongo (`mongoose`) present in deps (inspect code before using).
- Scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint`, `npm run postbuild` (sitemap).
- Env: see `.env.example` (notably `API_KEY`, `GOOGLE_TRANSLATE_API_KEY`). Do not hardcode secrets.

## 2) Agent Workflow
- Read first: skim repo layout with `rg --files` and inspect only what you need (`sed -n '1,200p'`).
- Plan: for multi-step tasks, publish a short plan and keep it updated as you progress.
- Patch only what’s needed: use small, surgical diffs; avoid unrelated refactors.
- Validate locally: prefer `npm run lint` and `npm run build` to catch issues early.
- Approvals & sandboxing: ask before network access, package installs, destructive actions, or running Docker. Keep commands explicit.
- Don’t auto-commit: provide patches; only commit/branch if the user requests.

## 3) Coding Conventions
- Language: JavaScript (ESM). Match existing style; follow ESLint. Avoid one-letter variable names.
- Structure:
  - UI: `components/**`, `styles.css`, Tailwind util-first classes (merge with `tailwind-merge` when composing).
  - Pages: `pages/**`. Use the Pages Router conventions.
  - APIs: `pages/api/**`. Keep handlers small, validate input, and return JSON.
  - Shared helpers: `lib/**`. Data models (if used) in `models/**`.
- i18n: Use `next-i18next`. Wrap user-visible strings with translation keys and use `useTranslation` / `serverSideTranslations` patterns.
- Accessibility: Prefer semantic HTML, label controls, keyboard navigation friendly Radix primitives.

## 4) Security & Privacy
- Secrets: Never log or echo env values (API keys, tokens). Keep secret logic server-only.
- Validation: Validate and sanitize all inputs (prefer `zod`). Fail fast with clear 4xx errors.
- AuthZ: Where API endpoints require an API key, verify against `process.env.API_KEY` with constant-time comparison.
- SSR/Edge safety: Avoid dynamic `eval`, SSRF, or fetching arbitrary URLs without allowlists.

## 5) Performance
- Client: Code-split with dynamic imports where heavy. Prefer memoization for expensive renders.
- Server/API: Avoid blocking calls; batch/parallelize I/O; stream large payloads when possible.
- Images/QR: Use `sharp` server-side for transforms; avoid massive canvases in the browser.

## 6) i18n Guidance
- User strings must be translatable. Add keys rather than literals.
- When adding keys, update base locale JSON and (optionally) run `node generate-translations.js` if a translation key pipeline is configured.
- Example usage:

```jsx
import { useTranslation } from 'react-i18next';

export default function Example() {
  const { t } = useTranslation();
  return <h1 className="text-xl font-semibold">{t('page.title')}</h1>;
}
```

## 7) API Route Template (Pages Router)
Create files under `pages/api/v1/*.js`. Keep pure, testable logic in `lib/**`.

```js
// pages/api/v1/echo.js
import { z } from 'zod';

const Body = z.object({ message: z.string().min(1) });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Optional API key check
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token || token !== apiKey) return res.status(401).json({ error: 'Unauthorized' });
  }

  const parse = Body.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid body', issues: parse.error.issues });

  return res.status(200).json({ echo: parse.data.message });
}
```

## 8) QR Feature Notes
- Use `qrcode` or `qr-code-styling` for client-side generation; prefer worker offloading for heavy tasks.
- For server exports (PNG/SVG/PDF), keep the API stateless; derive output from request body; use `sharp` for image transforms and `jspdf` for PDFs.

## 9) UI Component Template

```jsx
// components/Button.js
import { cn } from 'tailwind-merge';

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium',
        'bg-black text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black/20',
        className,
      )}
      {...props}
    />
  );
}
```

## 10) Local Development
- Install deps: `npm ci` (or `npm i` for local changes).
- Run dev server: `npm run dev`.
- Lint: `npm run lint`.
- Build: `npm run build` then `npm start`.
- Docker: `docker-compose up` if services are defined and required.

## 11) Typical Task Playbook
1. Clarify requirements and acceptance criteria.
2. Scan relevant files with ripgrep; read minimal context.
3. Draft a small plan; confirm assumptions if risky/ambiguous.
4. Implement with focused patches; keep diffs small and local.
5. Run lint/build locally; fix errors reported by ESLint/Next.
6. Update docs and examples when new behaviors or env vars appear.

## 12) Self-Check Before Hand-off
- Code compiles and lints cleanly.
- No credentials in code, logs, or error messages.
- Inputs validated; errors have clear JSON shape.
- Strings translatable; UI matches Tailwind/Radix conventions.
- README or `agent.md` updated if behavior changes.

## 13) Troubleshooting
- Build fails on sharp: ensure correct platform or use Docker to build.
- i18n not loading: verify `next-i18next.config.mjs` and `app/pages` usage.
- API 500s locally: add minimal logging (without secrets) and validate inputs.

---

This file is a living reference. Keep it concise and practical—update when patterns evolve or new subsystems are added.
