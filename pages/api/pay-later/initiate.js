export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { slug } = req.query;
  // Placeholder integration for pay-later; replace with PSP session creation later.
  const sessionId = Math.random().toString(36).slice(2);
  const url = `https://example-payments.test/session/${sessionId}?ref=${encodeURIComponent(slug || '')}`;
  return res.status(200).json({ success: true, url });
}

