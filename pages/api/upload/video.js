import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '50mb',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buf = Buffer.concat(chunks);

    const ctype = req.headers['content-type'] || 'application/octet-stream';
    if (!/^video\//i.test(ctype)) {
      return res.status(400).json({ success: false, message: 'Invalid content-type' });
    }

    const rawName = (req.headers['x-filename'] || 'video').toString();
    const safe = rawName.replace(/[^a-z0-9_.-]/gi, '_').slice(0, 64) || 'video';

    const ext = (() => {
      const m = /video\/(mp4|webm|ogg|quicktime|x-matroska)/i.exec(ctype);
      if (m) {
        const k = m[1].toLowerCase();
        if (k === 'quicktime') return '.mov';
        if (k === 'x-matroska') return '.mkv';
        return '.' + k;
      }
      const m2 = /\.(mp4|webm|ogg|mov|mkv)$/i.exec(safe);
      if (m2) return '.' + m2[1].toLowerCase();
      return '.mp4';
    })();

    const ts = Date.now();
    const finalName = `${path.parse(safe).name}-${ts}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'video');
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, finalName);
    fs.writeFileSync(filePath, buf);

    const url = `/uploads/video/${finalName}`;
    return res.status(200).json({ success: true, url });
  } catch (e) {
    console.error('upload-video-failed', e);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
}

