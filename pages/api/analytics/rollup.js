import { getRedis } from "@/lib/redis";
import { dbConnect } from "@/lib/mongoose";
import AnalyticsDaily from "@/models/AnalyticsDaily";

function dayKeysInRange(days) {
  const keys = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(`${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`);
  }
  return keys;
}

async function scanKeys(redis, pattern, limit = 1000) {
  const keys = [];
  let cursor = "0";
  do {
    // eslint-disable-next-line no-await-in-loop
    const [next, batch] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 1000);
    cursor = next;
    for (const k of batch) {
      keys.push(k);
      if (keys.length >= limit) return keys;
    }
  } while (cursor !== "0");
  return keys;
}

// Aggregates Redis daily counters into Mongo upserts for long-term retention.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { slug: slugFilter } = req.query;
  const days = Math.max(1, Math.min(365, Number(req.query.days || 30)));
  const dryRun = String(req.query.dryRun || "false").toLowerCase() === "true";

  const redis = getRedis();
  await dbConnect();

  // Discover slugs by scanning meta keys populated by logScanEvent
  const metaKeys = await scanKeys(redis, "qr:slug:*:meta", 5000);
  let slugs = metaKeys.map((k) => (k.match(/^qr:slug:(.*):meta$/) || [])[1]).filter(Boolean);
  if (slugFilter) slugs = slugs.filter((s) => s === slugFilter);

  const daysList = dayKeysInRange(days);
  const results = [];

  for (const slug of slugs) {
    const base = `qr:slug:${slug}`;
    const ops = [];
    for (const day of daysList) {
      // eslint-disable-next-line no-await-in-loop
      const count = await redis.get(`${base}:hits:${day}`).then((v) => Number(v || 0));
      if (count > 0) {
        ops.push({ slug, day, total: count });
      }
    }
    if (dryRun) {
      results.push({ slug, upserts: ops.length });
    } else {
      // Upsert sequentially to avoid huge bulk complexity for now
      // eslint-disable-next-line no-await-in-loop
      for (const op of ops) {
        // eslint-disable-next-line no-await-in-loop
        await AnalyticsDaily.findOneAndUpdate(
          { slug: op.slug, day: op.day },
          { $set: { total: op.total } },
          { upsert: true, new: true }
        );
      }
      results.push({ slug, upserts: ops.length });
    }
  }

  return res.status(200).json({ success: true, message: dryRun ? "Dry run complete" : "Rollup complete", results });
}
