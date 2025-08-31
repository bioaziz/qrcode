import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import { requireSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();
  const session = await requireSession(req, res);
  if (!session) return res.status(401).json({ success: false, message: "Unauthorized" });

  const { id } = req.query;

  const code = await QrCode.findOne({ _id: id, ownerId: session.user.id });
  if (!code) return res.status(404).json({ success: false, message: "Not found" });

  if (req.method === "GET") {
    return res.json({ success: true, item: code });
  }

  if (req.method === "PATCH") {
    const body = req.body || {};
    if (body.slug) code.slug = body.slug;
    if (body.type) code.type = body.type;
    if ("staticPayload" in body) code.staticPayload = body.staticPayload;
    if ("dynamicConfig" in body) code.dynamicConfig = body.dynamicConfig;
    if ("status" in body) code.status = body.status;
    if ("meta" in body) code.meta = body.meta;
    if ("designRef" in body) code.designRef = body.designRef;

    await code.save();
    return res.json({ success: true, item: code });
  }

  if (req.method === "DELETE") {
    code.status = "archived";
    await code.save();
    return res.json({ success: true, item: code });
  }

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).end("Method Not Allowed");
}

