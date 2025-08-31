import { dbConnect } from "@/lib/mongoose";
import Preset from "@/models/Preset";
import { requireSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();
  const session = await requireSession(req, res);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });
  const userId = session.user.id;

  if (req.method === 'GET') {
    const items = await Preset.find({ userId }).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ success: true, items });
  }

  if (req.method === 'POST') {
    try {
      const { name, snapshot } = req.body || {};
      const doc = await Preset.create({ userId, name, snapshot });
      return res.status(201).json({ success: true, item: doc });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
}
