import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.startsWith('application/pdf')) {
      return res.status(400).json({ success: false, message: 'Content-Type must be application/pdf' });
    }

    // Enforce max 100MB
    const len = parseInt(req.headers['content-length'] || '0', 10);
    const max = 100 * 1024 * 1024;
    if (len && len > max) {
      return res.status(413).json({ success: false, message: 'File too large (max 100MB)' });
    }

    // Ensure folder exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdf');
    fs.mkdirSync(uploadDir, { recursive: true });

    const rawName = (req.headers['x-filename'] || 'file.pdf').toString();
    const safeName = rawName.replace(/[^A-Za-z0-9_.-]+/g, '_');
    const timestamp = Date.now();
    const finalName = `${timestamp}-${safeName.endsWith('.pdf') ? safeName : safeName + '.pdf'}`;
    const filePath = path.join(uploadDir, finalName);

    const writeStream = fs.createWriteStream(filePath);
    let total = 0;
    await new Promise((resolve, reject) => {
      req.on('data', (chunk) => {
        total += chunk.length;
        if (total > max) {
          reject(new Error('File too large'));
          req.destroy();
          return;
        }
      });
      req.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      req.on('error', reject);
    });

    const url = `/uploads/pdf/${finalName}`;
    return res.status(200).json({ success: true, url, name: finalName, size: total });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
}

