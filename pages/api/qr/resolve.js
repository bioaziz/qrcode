import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import { computeDestination } from "@/lib/resolve";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ success: false, message: 'Missing slug' });
  await dbConnect();
  const code = await QrCode.findOne({ slug }).lean();
  if (!code || code.status !== 'active') return res.status(404).json({ success: false, message: 'Not found' });
  const destination = computeDestination(code, req.headers || {});
  return res.json({ success: true, destination });
}
