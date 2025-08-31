import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import { requireSession } from "@/lib/auth";
import crypto from "crypto";

export default async function handler(req, res) {
  await dbConnect();

  const session = await requireSession(req, res);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  if (req.method === "GET") {
    const { q, status, type, limit = 20, offset = 0 } = req.query;
    const filter = { ownerId: session.user.id };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (q) filter.$or = [{ slug: new RegExp(q, "i") }, { "meta.name": new RegExp(q, "i") }];

    const [items, total] = await Promise.all([
      QrCode.find(filter).sort({ createdAt: -1 }).skip(Number(offset)).limit(Number(limit)).lean(),
      QrCode.countDocuments(filter),
    ]);
    return res.json({ success: true, items, total });
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const slug = (body.slug || crypto.randomBytes(5).toString("hex")).toLowerCase();
      const doc = await QrCode.create({
        ownerId: session.user.id,
        slug,
        type: body.type || "static",
        staticPayload: body.staticPayload || "",
        dynamicConfig: body.dynamicConfig || { primaryUrl: body.primaryUrl || "" },
        meta: body.meta || { name: body.name || slug },
        designRef: body.designRef || null,
      });
      return res.status(201).json({ success: true, item: doc });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}

