import { dbConnect } from "@/lib/mongoose";
import Design from "@/models/Design";
import { requireSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();
  const session = await requireSession(req, res);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      // Accept either { snapshot, name } or a raw snapshot
      const snapshot = body.snapshot ?? body;
      const name = body.name ?? snapshot?.name ?? 'Untitled';
      const payload = { name, snapshot };
      const design = await Design.create(payload);
      return res.status(201).json({ success: true, item: design });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  if (req.method === 'GET') {
    const items = await Design.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return res.json({ success: true, items });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
}
