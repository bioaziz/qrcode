import { getSummary } from "@/lib/redis";

export default async function handler(req, res) {
  const { slug, days } = req.query;
  if (!slug) return res.status(400).json({ success: false, message: "Missing slug" });
  try {
    const data = await getSummary({ slug, days: Number(days || 14) });
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

