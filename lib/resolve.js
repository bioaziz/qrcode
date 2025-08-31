export function detectDevice(ua = "") {
  const s = (ua || "").toLowerCase();
  if (s.includes("android")) return "android";
  if (s.includes("iphone") || s.includes("ipad") || s.includes("ios")) return "ios";
  return "desktop";
}

function inArrayOrEmpty(value, arr) {
  if (!Array.isArray(arr) || arr.length === 0) return true;
  return arr.includes(value);
}

export function matchWhen(when, now = new Date()) {
  if (!when) return true;
  try {
    const tz = when.tz || 'UTC';
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour: '2-digit',
      hour12: false,
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const weekday = map[parts.weekday] ?? now.getUTCDay();
    const hour = Number(parts.hour ?? now.getUTCHours());
    const dayOk = inArrayOrEmpty(weekday, when.dayOfWeek);
    const hourOk = inArrayOrEmpty(hour, when.hours);
    return dayOk && hourOk;
  } catch (e) {
    return true;
  }
}

export function chooseAbSplit(abSplits = [], seedIndex = null) {
  if (!Array.isArray(abSplits) || abSplits.length === 0) return null;
  if (seedIndex != null) {
    const idx = ((seedIndex % abSplits.length) + abSplits.length) % abSplits.length;
    return abSplits[idx]?.url || null;
  }
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

export function computeDestination(code, headers = {}) {
  const device = detectDevice(headers["user-agent"] || "");
  const country = headers["x-vercel-ip-country"] || headers["cf-ipcountry"] || "unknown";
  const city = headers["x-vercel-ip-city"] || headers["x-real-city"] || "unknown";

  const rules = code?.dynamicConfig?.rules || [];
  for (const rule of rules) {
    const whenOk = matchWhen(rule.when);
    const geoOk = inArrayOrEmpty(country, rule.geo?.country) && inArrayOrEmpty(city, rule.geo?.city);
    const deviceOk = !rule.device || rule.device === device;
    if (whenOk && geoOk && deviceOk && rule.url) {
      return rule.url;
    }
  }

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

  const abUrl = chooseAbSplit(abSplits);
  if (abUrl) return abUrl;

  if (code.type === "static") return code.staticPayload || "/";
  if (code.type === "dynamic") return code.dynamicConfig?.primaryUrl || "/";
  return code.staticPayload || code.dynamicConfig?.primaryUrl || "/";
}
