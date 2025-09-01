import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import { requireSession } from "@/lib/auth";

function toCsv(rows) {
  const headers = ["_id","slug","type","name","createdAt"]; 
  const esc = (v) => '"' + String(v ?? '').replace(/"/g,'""') + '"';
  const out = [headers.join(",")];
  for (const r of rows) {
    out.push([r._id, r.slug, r.type, r.meta?.name || '', r.createdAt].map(esc).join(","));
  }
  return out.join("\n");
}

export default async function handler(req, res) {
  await dbConnect();
  const session = await requireSession(req, res);
  if (!session) return res.status(401).end("Unauthorized");
  const { format = 'json' } = req.query;
  const items = await QrCode.find({ ownerId: session.user.id }).sort({ createdAt: -1 }).lean();
  if (format === 'csv') {
    const csv = toCsv(items);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qrcodes.csv"');
    return res.status(200).send(csv);
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="qrcodes.json"');
  return res.status(200).send(JSON.stringify(items, null, 2));
}
