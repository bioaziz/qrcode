// Lightweight geo helpers with optional local IP database lookup.
// No external network calls. If `geoip-lite` is not installed, fallbackLookup returns {}.

const COUNTRY_HEADERS = [
  'x-vercel-ip-country',
  'cf-ipcountry',
  'x-real-country',
  'x-geoip-country',
  'x-geoip-country-code',
];

const CITY_HEADERS = [
  'x-vercel-ip-city',
  'x-real-city',
  'x-geoip-city',
];

export function extractGeoFromHeaders(headers = {}) {
  const entries = Object.entries(headers || {}).map(([k, v]) => [String(k).toLowerCase(), v]);
  const lower = Object.fromEntries(entries);
  const country = COUNTRY_HEADERS.map((h) => lower[h]).find((v) => typeof v === 'string' && v.trim());
  const city = CITY_HEADERS.map((h) => lower[h]).find((v) => typeof v === 'string' && v.trim());
  return { country, city };
}

export function getIp(req) {
  try {
    const fwd = req?.headers?.['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
    if (Array.isArray(fwd) && fwd.length) return String(fwd[0]).split(',')[0].trim();
    const ra = req?.socket?.remoteAddress || req?.connection?.remoteAddress;
    if (typeof ra === 'string') return ra;
  } catch (_) {}
  return undefined;
}

function isPrivateIp(ip) {
  if (!ip) return true;
  const x = ip.replace('::ffff:', '');
  return (
    x === '127.0.0.1' ||
    x === '::1' ||
    x.startsWith('10.') ||
    x.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(x)
  );
}

export function fallbackGeoLookup(ip) {
  try {
    if (!ip || isPrivateIp(ip)) return {};
    // eslint-disable-next-line global-require
    const geoip = require('geoip-lite');
    if (!geoip || typeof geoip.lookup !== 'function') return {};
    const info = geoip.lookup(ip);
    if (!info) return {};
    const country = info.country || undefined;
    const city = info.city || undefined;
    return { country, city };
  } catch (_) {
    return {};
  }
}

export const GEO_LOOKUP_ENABLED = process.env.GEO_LOOKUP === '1' || process.env.GEO_LOOKUP === 'true';

