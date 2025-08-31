import { dbConnect } from "@/lib/mongoose";
import Setting from "@/models/Setting";
import { getServerSession } from "next-auth/next";
import { isAdminEmail } from "@/lib/admin";

export default async function handler(req, res) {
  await dbConnect();
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(req, res, authOptions);
  if (!session || !isAdminEmail(session.user?.email)) return res.status(401).json({ success: false });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ success: false, message: 'Missing key' });
  const doc = await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true });
  return res.json({ success: true, item: doc });
}
