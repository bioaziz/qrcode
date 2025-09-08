import { dbConnect } from "@/lib/mongoose";
import Design from "@/models/Design";
import { requireSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();
  const session = await requireSession(req, res);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });
  const { id } = req.query;

  const design = await Design.findById(id);
  if (!design) return res.status(404).json({ success: false, message: 'Not found' });

  if (req.method === 'GET') return res.json({ success: true, item: design });

  if (req.method === 'PATCH') {
    try {
      const body = req.body || {};
      if (Object.prototype.hasOwnProperty.call(body, 'snapshot')) {
        if (body.name) design.name = body.name;
        design.snapshot = body.snapshot;
      } else {
        // Back-compat: treat the entire body as the snapshot if no 'snapshot' key
        design.snapshot = body;
      }
      await design.save();
      return res.json({ success: true, item: design });
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).end('Method Not Allowed');
}
