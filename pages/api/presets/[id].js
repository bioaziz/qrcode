import { dbConnect } from "@/lib/mongoose";
import Preset from "@/models/Preset";
import { requireSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();
  const session = await requireSession(req, res);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });
  const userId = session.user.id;
  const { id } = req.query;

  const doc = await Preset.findOne({ _id: id, userId });
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });

  if (req.method === 'DELETE') {
    await doc.deleteOne();
    return res.json({ success: true });
  }

  if (req.method === 'GET') {
    return res.json({ success: true, item: doc });
  }

  res.setHeader('Allow', 'GET, DELETE');
  return res.status(405).end('Method Not Allowed');
}
