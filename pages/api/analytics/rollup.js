import { hasRedis } from "@/lib/redis";

// Placeholder endpoint for a cron/worker to roll up Redis metrics into MongoDB.
// In Week 2 we expose the endpoint; in Week 3+ we can implement time-windowed aggregation.
export default async function handler(req, res) {
  if (!hasRedis()) return res.status(200).json({ success: true, message: "Redis not configured; nothing to roll up" });
  // TODO: Implement SCAN-based aggregation into Mongo rollups in Week 3
  return res.status(200).json({ success: true, message: "Rollup stub executed" });
}

