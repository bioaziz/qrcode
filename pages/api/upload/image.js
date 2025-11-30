import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '20mb',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buf = Buffer.concat(chunks);

    const ctype = req.headers['content-type'] || 'application/octet-stream';
    if (!/^image\//i.test(ctype)) {
      return res.status(400).json({ success: false, message: 'Invalid content-type' });
    }

    const rawName = (req.headers['x-filename'] || 'image').toString();
    const safe = rawName.replace(/[^a-z0-9_.-]/gi, '_').slice(0, 64) || 'image';

    const ext = (() => {
      const m = /image\/(png|jpe?g|gif|webp|svg\+xml|svg)/i.exec(ctype);
      if (m) {
        const k = m[1].toLowerCase();
        if (k === 'svg+xml' || k === 'svg') return '.svg';
        if (k === 'jpeg' || k === 'jpg') return '.jpg';
        return '.' + k;
      }
      const m2 = /\.(png|jpe?g|gif|webp|svg)$/i.exec(safe);
      if (m2) {
        const k = m2[1].toLowerCase();
        if (k === 'jpeg' || k === 'jpg') return '.jpg';
        return '.' + k;
      }
      return '.img';
    })();

    const ts = Date.now();
    const finalName = `${path.parse(safe).name}-${ts}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'image');
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, finalName);
    fs.writeFileSync(filePath, buf);

    const url = `/uploads/image/${finalName}`;
    return res.status(200).json({ success: true, url });
  } catch (e) {
    console.error('upload-image-failed', e);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
}

