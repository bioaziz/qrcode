import { generateSvg, svgToPng, embedLogoSvg, composeLogoOnPng } from '../../../lib/qr.js';
import { verifyGetSignature } from '../../../lib/sign.js';
import { z } from 'zod';

const querySchema = z.object({
  data: z.string(),
  size: z.coerce.number().int().min(64).max(2048).default(256),
  margin: z.coerce.number().int().min(0).max(20).default(1),
  ec: z.enum(['L','M','Q','H']).default('M'),
  format: z.enum(['png','svg']).default('png'),
  fg: z.string().optional(),
  bg: z.string().optional(),
  gradient: z.coerce.boolean().optional(),
  gFrom: z.string().optional(),
  gTo: z.string().optional(),
  gAngle: z.coerce.number().optional(),
  logo: z.string().url().optional(),
  sig: z.string().optional(),
  exp: z.coerce.number().optional(),
  download: z.coerce.boolean().optional()
});

const bodySchema = querySchema.extend({
  return: z.enum(['binary','data-url']).default('binary')
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ success:false, message:'Invalid query' });
    }
    const q = parsed.data;
    if (q.sig && !verifyGetSignature(req.url)) {
      return res.status(401).json({ success:false, message:'Invalid signature' });
    }
    let svg;
    try {
      svg = await generateSvg(q);
      if (q.logo) svg = await embedLogoSvg(svg, q.logo, 0.2);
    } catch (e) {
      return res.status(500).json({ success:false, message:e.message });
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (q.download) {
      res.setHeader('Content-Disposition', `attachment; filename="qrcode.${q.format}"`);
    }
    if (q.format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(svg);
    }
    try {
      let png = await svgToPng(svg, q.size);
      if (q.logo) png = await composeLogoOnPng(png, q.logo, q.size, 0.2);
      res.setHeader('Content-Type', 'image/png');
      return res.send(png);
    } catch (e) {
      return res.status(500).json({ success:false, message:e.message });
    }
  }

  if (req.method === 'POST') {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${process.env.API_KEY}`) {
      return res.status(401).json({ success:false, message:'Unauthorized' });
    }
    const parsed = bodySchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ success:false, message:'Invalid body' });
    }
    const b = parsed.data;
    let svg;
    try {
      svg = await generateSvg(b);
      if (b.logo) svg = await embedLogoSvg(svg, b.logo, 0.2);
    } catch (e) {
      return res.status(500).json({ success:false, message:e.message });
    }
    if (b.format === 'svg') {
      const buf = Buffer.from(svg);
      if (b.return === 'data-url') {
        return res.json({ dataUrl: `data:image/svg+xml;base64,${buf.toString('base64')}` });
      }
      if (b.download) {
        res.setHeader('Content-Disposition', 'attachment; filename="qrcode.svg"');
      }
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(buf);
    }
    try {
      let png = await svgToPng(svg, b.size);
      if (b.logo) png = await composeLogoOnPng(png, b.logo, b.size, 0.2);
      if (b.return === 'data-url') {
        return res.json({ dataUrl: `data:image/png;base64,${png.toString('base64')}` });
      }
      if (b.download) {
        res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
      }
      res.setHeader('Content-Type', 'image/png');
      return res.send(png);
    } catch (e) {
      return res.status(500).json({ success:false, message:e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
