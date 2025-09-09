// Redis client with graceful fallback when not configured.
// eslint-disable-next-line global-require
const RedisImpl = require("ioredis");

const REDIS_URL = process.env.REDIS_URL ;
// Note: UPSTASH_REDIS_REST_URL is not compatible with ioredis; ignore here.

let redis = null;
let redisEnabled = false;
if (REDIS_URL) {
  try {
    redis = new RedisImpl(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 });
    // Connect in background; errors will surface on first command
    redis.connect().catch(() => {});
    // Swallow connection errors and degrade gracefully
    redis.on('error', (err) => {
      try {
        // eslint-disable-next-line no-console
        console.warn('[redis] error:', err?.message || err);
      } catch (_) {}
      redisEnabled = false;
    });
    redisEnabled = true;
  } catch (_) {
    redis = null;
    redisEnabled = false;
  }
}

export function isRedisEnabled() {
  return redisEnabled && !!redis;
}

export function getRedis() {
  return redis;
}

export async function logScanEvent({ slug, qrId, country = "unknown", city = "unknown", device = "unknown" }) {
  if (!slug) return;
  if (!isRedisEnabled()) return; // no-op if Redis not configured
  const now = new Date();
  const day = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const base = `qr:slug:${slug}`;
  const pipe = redis.pipeline();
  pipe.incr(`${base}:hits`);
  pipe.incr(`${base}:hits:${day}`);
  pipe.hincrby(`${base}:device`, device || "unknown", 1);
  // Include "unknown" buckets to make local testing visible
  pipe.hincrby(`${base}:country`, country || "unknown", 1);
  pipe.hincrby(`${base}:city`, city || "unknown", 1);
  if (qrId) pipe.hset(`${base}:meta`, "qrId", String(qrId));
  try {
    await pipe.exec();
  } catch (_) {
    // ignore logging failures
  }
}

export async function getSummary({ slug, days = 14 }) {
  if (!slug) throw new Error("Missing slug");

  // Graceful zeroed summary when Redis is disabled
  if (!isRedisEnabled()) {
    const daily = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      d.setUTCDate(d.getUTCDate() - i);
      const key = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
      daily.push({ day: key, count: 0 });
    }
    return { total: 0, daily, devices: {}, countries: {}, cities: {} };
  }

  try {
    const base = `qr:slug:${slug}`;
    const total = await redis.get(`${base}:hits`).then((v) => Number(v || 0));
    const daily = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      d.setUTCDate(d.getUTCDate() - i);
      const key = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
      // eslint-disable-next-line no-await-in-loop
      const v = await redis.get(`${base}:hits:${key}`).then((x) => Number(x || 0));
      daily.push({ day: key, count: v });
    }
    const [devices, countries, cities] = await Promise.all([
      redis.hgetall(`${base}:device`).then((o) => o || {}),
      redis.hgetall(`${base}:country`).then((o) => o || {}),
      redis.hgetall(`${base}:city`).then((o) => o || {}),
    ]);
    return { total, daily, devices, countries, cities };
  } catch (_) {
    return {
      total: 0,
      daily: Array.from({ length: days }, (_, i) => {
        const now = new Date();
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        d.setUTCDate(d.getUTCDate() - (days - 1 - i));
        const key = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
        return { day: key, count: 0 };
      }),
      devices: {},
      countries: {},
      cities: {},
    };
  }
}
