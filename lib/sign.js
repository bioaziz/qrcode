import crypto from 'crypto';

export function signQuery(params = {}) {
  const key = process.env.API_KEY || '';
  const search = new URLSearchParams(params);
  const entries = Array.from(search.entries()).sort(([a],[b]) => a.localeCompare(b));
  const canonical = new URLSearchParams(entries);
  const sig = crypto.createHmac('sha256', key).update(canonical.toString()).digest('hex');
  canonical.set('sig', sig);
  return canonical.toString();
}

export function verifyGetSignature(url) {
  const key = process.env.API_KEY;
  if (!key) return false;
  const u = new URL(url, 'http://localhost');
  const sig = u.searchParams.get('sig');
  if (!sig) return false;
  const exp = u.searchParams.get('exp');
  if (exp && Date.now() > Number(exp) * 1000) return false;
  const params = new URLSearchParams(u.search);
  params.delete('sig');
  const entries = Array.from(params.entries()).sort(([a],[b]) => a.localeCompare(b));
  const canonical = new URLSearchParams(entries).toString();
  const expected = crypto.createHmac('sha256', key).update(canonical).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
