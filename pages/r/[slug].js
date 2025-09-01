import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import { logScanEvent } from "@/lib/redis";
import { getSetting } from "@/lib/settings";

function detectDevice(ua = "") {
  const s = ua.toLowerCase();
  if (s.includes("android")) return "android";
  if (s.includes("iphone") || s.includes("ipad") || s.includes("ios")) return "ios";
  return "desktop";
}

function inArrayOrEmpty(value, arr) {
  if (!Array.isArray(arr) || arr.length === 0) return true;
  return arr.includes(value);
}

function matchWhen(when, now = new Date()) {
  if (!when) return true;
  try {
    // Apply timezone by constructing a date in that tz via Intl if provided
    const tz = when.tz || 'UTC';
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour: '2-digit',
      hour12: false,
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
    // Map weekday short to 0..6 (Sun..Sat)
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const weekday = map[parts.weekday] ?? now.getUTCDay();
    const hour = Number(parts.hour ?? now.getUTCHours());
    const dayOk = inArrayOrEmpty(weekday, when.dayOfWeek);
    const hourOk = inArrayOrEmpty(hour, when.hours);
    return dayOk && hourOk;
  } catch (e) {
    return true; // be permissive on formatter errors
  }
}

function chooseAbSplit(abSplits = [], seedIndex = null) {
  if (!Array.isArray(abSplits) || abSplits.length === 0) return null;
  if (seedIndex != null) {
    const idx = ((seedIndex % abSplits.length) + abSplits.length) % abSplits.length;
    return abSplits[idx]?.url || null;
  }
  // Weighted random by ratio; fallback equal if missing ratios
  const total = abSplits.reduce((sum, v) => sum + (typeof v.ratio === 'number' ? v.ratio : 0), 0);
  let r = Math.random() * (total || abSplits.length);
  if (!total) {
    const idx = Math.floor(Math.random() * abSplits.length);
    return abSplits[idx]?.url || null;
  }
  for (const v of abSplits) {
    const w = typeof v.ratio === 'number' ? v.ratio : 0;
    if (r <= w) return v.url || null;
    r -= w;
  }
  return abSplits[abSplits.length - 1]?.url || null;
}

function computeDestination(code, headers) {
  const device = detectDevice(headers["user-agent"] || "");
  const country = headers["x-vercel-ip-country"] || headers["cf-ipcountry"] || "unknown";
  const city = headers["x-vercel-ip-city"] || headers["x-real-city"] || "unknown";

  // 1) Rules evaluation (first match wins)
  const rules = code?.dynamicConfig?.rules || [];
  for (const rule of rules) {
    const whenOk = matchWhen(rule.when);
    const geoOk = inArrayOrEmpty(country, rule.geo?.country) && inArrayOrEmpty(city, rule.geo?.city);
    const deviceOk = !rule.device || rule.device === device;
    if (whenOk && geoOk && deviceOk && rule.url) {
      return rule.url;
    }
  }

  // 2) Rotation (totp/interval) over abSplits if present
  const abSplits = code?.dynamicConfig?.abSplits || [];
  const rot = code?.dynamicConfig?.rotation || {};
  if (abSplits.length > 0 && rot?.mode) {
    const now = new Date();
    if (rot.mode === 'totp' && rot.stepSec) {
      const bucket = Math.floor(now.getTime() / 1000 / rot.stepSec);
      const url = chooseAbSplit(abSplits, bucket);
      if (url) return url;
    }
    if (rot.mode === 'interval' && rot.intervalMin) {
      const bucket = Math.floor(now.getTime() / 1000 / (rot.intervalMin * 60));
      const url = chooseAbSplit(abSplits, bucket);
      if (url) return url;
    }
  }

  // 3) A/B split (weighted)
  const abUrl = chooseAbSplit(abSplits);
  if (abUrl) return abUrl;

  // 4) Fallback by type or defaults
  if (code.type === "static") return code.staticPayload || "/";
  if (code.type === "dynamic") return code.dynamicConfig?.primaryUrl || "/";
  return code.staticPayload || code.dynamicConfig?.primaryUrl || "/";
}

export async function getServerSideProps(ctx) {
  const { slug } = ctx.params;
  await dbConnect();
  const code = await QrCode.findOne({ slug }).lean();
  if (!code || code.status !== "active") {
    const fb = await getSetting('fallback.redirect', '/');
    return {
      redirect: { destination: fb || "/", permanent: false },
    };
  }

  const destination = computeDestination(code, ctx.req.headers || {});

  // pick up geo hints from common headers (Vercel/Cloudflare), fall back to unknown
  const headers = ctx.req.headers || {};
  const country = headers["x-vercel-ip-country"] || headers["cf-ipcountry"] || "unknown";
  const city = headers["x-vercel-ip-city"] || headers["x-real-city"] || "unknown";
  const device = detectDevice(headers["user-agent"] || "");

  // fire-and-forget log; don't block redirect on logging errors
  logScanEvent({ slug, qrId: code._id?.toString?.(), country, city, device }).catch(() => {});

  ctx.res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return {
    redirect: { destination, permanent: false },
  };
}

export default function RedirectPage() {
  return null;
}
