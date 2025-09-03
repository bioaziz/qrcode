let QRCodeLib;
let sharpLib;

async function getQRCode() {
  if (!QRCodeLib) {
    QRCodeLib = (await import('qrcode')).default;
  }
  return QRCodeLib;
}

async function getSharp() {
  if (!sharpLib) {
    const mod = await import('sharp');
    sharpLib = mod.default || mod;
  }
  return sharpLib;
}

/**
 * Generate an SVG string for the given data and styling options.
 * @param {Object} opts
 * @returns {Promise<string>}
 */
export async function generateSvg(opts = {}) {
  const {
    data,
    size = 256,
    margin = 1,
    ec = 'M',
    fg = '#000000',
    bg = '#FFFFFF',
    gradient = false,
    gFrom = '#000000',
    gTo = '#000000',
    gAngle = 0,
  } = opts;

  const QRCode = await getQRCode();
  const svg = await QRCode.toString(data, {
    type: 'svg',
    errorCorrectionLevel: ec,
    margin,
    width: size,
    color: { dark: fg, light: bg },
  });

  if (!gradient) return svg;

  const gradId = 'grad';
  const def = `\n<defs><linearGradient id="${gradId}" gradientTransform="rotate(${gAngle})"><stop offset="0%" stop-color="${gFrom}" /><stop offset="100%" stop-color="${gTo}" /></linearGradient></defs>`;
  return svg
    .replace('<svg', `<svg`)
    .replace(/<svg[^>]*>/, (m) => `${m}${def}`)
    .replace(/fill="[^"]*"/g, `fill="url(#${gradId})"`);
}

/**
 * Convert an SVG string to a PNG buffer using sharp.
 * @param {string} svg
 * @param {number} size
 * @returns {Promise<Buffer>}
 */
export async function svgToPng(svg, size) {
  const sharp = await getSharp();
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

/**
 * Embed a logo into the SVG using an <image> tag.
 * @param {string} svg
 * @param {string} logoUrl
 * @param {number} relativeSize between 0-1
 * @returns {Promise<string>}
 */
export async function embedLogoSvg(svg, logoUrl, relativeSize = 0.2) {
  const match = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const size = match ? Number(match[1]) : 256;
  const logoSize = size * relativeSize;
  const x = (size - logoSize) / 2;
  const image = `<image href="${logoUrl}" x="${x}" y="${x}" width="${logoSize}" height="${logoSize}" />`;
  return svg.replace('</svg>', `${image}</svg>`);
}

/**
 * Composite a logo onto a PNG buffer.
 * @param {Buffer} pngBuffer
 * @param {string} logoUrl
 * @param {number} size
 * @param {number} relativeSize
 * @returns {Promise<Buffer>}
 */
export async function composeLogoOnPng(pngBuffer, logoUrl, size, relativeSize = 0.2) {
  const sharp = await getSharp();
  const logoResp = await fetch(logoUrl);
  const logoBuf = Buffer.from(await logoResp.arrayBuffer());
  const logoSize = Math.round(size * relativeSize);
  const logoPng = await sharp(logoBuf).resize(logoSize, logoSize).png().toBuffer();
  const position = Math.round((size - logoSize) / 2);
  return sharp(pngBuffer)
    .composite([{ input: logoPng, top: position, left: position }])
    .png()
    .toBuffer();
}
