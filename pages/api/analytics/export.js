import { getSummary } from "@/lib/redis";

const DIMENSIONS = new Set(["devices", "countries", "cities"]);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }
  const { slug, dim, days } = req.query;
  const dimension = String(dim || "");
  if (!slug) return res.status(400).json({ success: false, message: "Missing slug" });
  if (!DIMENSIONS.has(dimension)) return res.status(400).json({ success: false, message: "Invalid dim; use devices|countries|cities" });

  const summary = await getSummary({ slug, days: Number(days || 14) });
  const total = Number(summary?.total || 0);
  const obj = summary?.[dimension] || {};
  const rows = Object.entries(obj).map(([k, v]) => ({ key: k, count: Number(v || 0) }))
    .sort((a, b) => b.count - a.count);

  let csv = "key,count,percent\n";
  for (const r of rows) {
    const pct = total ? Math.round((r.count / total) * 100) : 0;
    // Escape potential commas/quotes in key
    const safeKey = /[,"]/.test(r.key) ? `"${String(r.key).replace(/"/g, '""')}"` : r.key;
    csv += `${safeKey},${r.count},${pct}\n`;
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=\"${slug}-${dimension}.csv\"`);
  return res.status(200).send(csv);
}

