let RedisImpl = null;
try {
  // Optional dependency; code should not crash if missing
  // eslint-disable-next-line global-require
  RedisImpl = require("ioredis");
} catch (e) {
  RedisImpl = null;
}

const REDIS_URL = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || "";

let redis = null;
if (RedisImpl && REDIS_URL) {
  try {
    redis = new RedisImpl(REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
    // Attempt to connect in the background
    redis.connect().catch(() => {});
  } catch (e) {
    redis = null;
  }
}

export function hasRedis() {
  return !!redis;
}

export async function logScanEvent({ slug, qrId, country = "unknown", city = "unknown", device = "unknown" }) {
  if (!redis || !slug) return;
  const now = new Date();
  const day = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const base = `qr:slug:${slug}`;
  const pipe = redis.pipeline();
  pipe.incr(`${base}:hits`);
  pipe.incr(`${base}:hits:${day}`);
  pipe.hincrby(`${base}:device`, device, 1);
  if (country && country !== "unknown") pipe.hincrby(`${base}:country`, country, 1);
  if (city && city !== "unknown") pipe.hincrby(`${base}:city`, city, 1);
  if (qrId) pipe.hset(`${base}:meta`, "qrId", String(qrId));
  await pipe.exec();
}

export async function getSummary({ slug, days = 14 }) {
  if (!redis || !slug) {
    return { total: 0, daily: [], devices: {}, countries: {}, cities: {} };
  }
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
}

