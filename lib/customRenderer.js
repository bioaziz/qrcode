// Lightweight QR renderer with circular finder eyes and basic shapes/gradients
// Uses qrcode-generator to get the matrix; draws onto a canvas.

/* eslint-disable no-param-reassign */
import QRGenFactory from "qrcode-generator";

function makeBackgroundFill(ctx, w, h, bg) {
  if (!bg) return "#ffffff";
  if (bg.gradient && bg.gradient.colorStops && Array.isArray(bg.gradient.colorStops)) {
    const g = bg.gradient;
    if (g.type === "radial") {
      const r = Math.max(w, h) * 0.75;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, r);
      for (const cs of g.colorStops) grad.addColorStop(cs.offset, cs.color);
      return grad;
    }
    // linear
    const rot = Number(g.rotation || 0);
    const cx = w / 2; const cy = h / 2;
    const dx = Math.cos(rot) * cx; const dy = Math.sin(rot) * cy;
    const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    for (const cs of g.colorStops) grad.addColorStop(cs.offset, cs.color);
    return grad;
  }
  return bg.color || "#ffffff";
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawModule(ctx, shape, x, y, s, color) {
  ctx.fillStyle = color;
  if (shape === "dots") {
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (shape === "rounded") {
    const r = s * 0.25;
    roundRect(ctx, x, y, s, s, r);
    ctx.fill();
    return;
  }
  if (shape === "extra-rounded") {
    const r = s * 0.5;
    roundRect(ctx, x, y, s, s, r);
    ctx.fill();
    return;
  }
  // fallback and "square"
  ctx.fillRect(x, y, s, s);
}

function drawFinderCircle(ctx, cx, cy, module, colors, bgFill, variant = 'solid', innerType = 'dot', bgIsTransparent = false, ringWidthUnits = 0.6, innerUnitsOverride = null) {
  // Standard finder pattern is 7 modules outer; defaults below mimic spec
  const rOuter = module * 3.5;
  if (variant === 'ring') {
    ringWidthUnits = Number(ringWidthUnits || 0.6); // thinner outer ring
    const innerDotUnits = Number(innerUnitsOverride != null ? innerUnitsOverride : 1.2); // smaller inner mark to create visible gap
    const rGapOuter = module * (3.5 - ringWidthUnits);
    const rInner = module * innerDotUnits;
    // Outer ring
    ctx.beginPath();
    ctx.fillStyle = colors.outer;
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.fill();
    // Carve inner of ring
    if (bgIsTransparent) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, rGapOuter, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = prev;
    } else {
      ctx.beginPath();
      ctx.fillStyle = bgFill;
      ctx.arc(cx, cy, rGapOuter, 0, Math.PI * 2);
      ctx.fill();
    }
    // Inner mark (square or dot)
    ctx.fillStyle = colors.inner;
    if (innerType === 'square') {
      const side = rInner * 2; // diameter equivalent
      ctx.fillRect(cx - side / 2, cy - side / 2, side, side);
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  // solid (spec-like) ring
  const rMid = module * 2.5; // background ring
  const rInner = module * (innerUnitsOverride != null ? Number(innerUnitsOverride) : 1.5); // inner mark ~3 modules by default
  // Outer filled circle (ring background)
  ctx.beginPath();
  ctx.fillStyle = colors.outer;
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
  ctx.fill();
  // Punch middle
  if (bgIsTransparent) {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, rMid, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = prev;
  } else {
    ctx.beginPath();
    ctx.fillStyle = bgFill;
    ctx.arc(cx, cy, rMid, 0, Math.PI * 2);
    ctx.fill();
  }
  // Inner mark (square or dot)
  ctx.fillStyle = colors.inner;
  if (innerType === 'square') {
    const side = rInner * 2; // 3 modules across
    ctx.fillRect(cx - side / 2, cy - side / 2, side, side);
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
    ctx.fill();
  }
}

export async function renderCustomQR(canvas, opts) {
  const {
    width = 256,
    height = 256,
    data = "",
    qrOptions = {},
    backgroundOptions = {},
    dotsOptions = {},
    cornersSquareOptions = {},
    cornersDotOptions = {},
    image,
    imageOptions = {},
    borderOptions = {},
  } = opts || {};

  const dpr = (typeof window !== "undefined" && window.devicePixelRatio) ? window.devicePixelRatio : 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${Math.round(width)}px`;
  canvas.style.height = `${Math.round(height)}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const bgFill = makeBackgroundFill(ctx, width, height, backgroundOptions);
  const bgIsTransparent = String(backgroundOptions?.color || '').toLowerCase() === 'transparent';
  // Paint background
  ctx.fillStyle = bgFill;
  ctx.fillRect(0, 0, width, height);

  // Build QR matrix
  const ecMap = { L: "L", M: "M", Q: "Q", H: "H" };
  const ec = ecMap[qrOptions.errorCorrectionLevel] || "M";
  const QR = QRGenFactory(0, ec);
  QR.addData(data || "");
  QR.make();
  const count = QR.getModuleCount();
  const quiet = Math.max(0, Number(qrOptions.margin || 0));
  const area = Math.min(width, height);
  const inner = Math.max(0, area - quiet * 2);
  const pixels = Math.max(1, Math.floor(inner / count));
  const size = pixels * count;
  const offsetX = Math.floor((width - size) / 2);
  const offsetY = Math.floor((height - size) / 2);

  // Prepare dots color/gradient
  let dotsFill = dotsOptions?.color || "#111";
  if (dotsOptions?.gradient && Array.isArray(dotsOptions.gradient.colorStops)) {
    const g = dotsOptions.gradient;
    if (g.type === "radial") {
      const r = Math.max(width, height) * 0.75;
      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, r);
      for (const cs of g.colorStops) grad.addColorStop(cs.offset, cs.color);
      dotsFill = grad;
    } else {
      const rot = Number(g.rotation || 0);
      const cx = width / 2; const cy = height / 2;
      const dx = Math.cos(rot) * cx; const dy = Math.sin(rot) * cy;
      const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
      for (const cs of g.colorStops) grad.addColorStop(cs.offset, cs.color);
      dotsFill = grad;
    }
  }

  // Draw modules
  const shape = dotsOptions?.type || "square";
  const inFinder = (r, c) => (
    (r <= 6 && c <= 6) || // top-left 7x7
    (r <= 6 && c >= count - 7) || // top-right 7x7
    (r >= count - 7 && c <= 6) // bottom-left 7x7
  );
  for (let r = 0; r < count; r += 1) {
    for (let c = 0; c < count; c += 1) {
      if (inFinder(r, c)) continue; // leave finder areas to custom circle renderer
      if (!QR.isDark(r, c)) continue;
      const x = offsetX + c * pixels;
      const y = offsetY + r * pixels;
      drawModule(ctx, shape, x, y, pixels, dotsFill);
    }
  }

  // Draw circular finder eyes (top-left, top-right, bottom-left)
  const csColor = cornersSquareOptions?.color || (typeof dotsFill === "string" ? dotsFill : "#111");
  const cdColor = cornersDotOptions?.color || csColor;
  const centers = [
    [offsetX + pixels * 3.5, offsetY + pixels * 3.5], // TL
    [offsetX + pixels * (count - 3.5), offsetY + pixels * 3.5], // TR
    [offsetX + pixels * 3.5, offsetY + pixels * (count - 3.5)], // BL
  ];
  const variant = /circle\-ring/.test(String(cornersSquareOptions?.type || '')) ? 'ring' : 'solid';
  const innerType = (String(cornersDotOptions?.type || '').toLowerCase() === 'square') ? 'square' : 'dot';
  const ringWidthUnits = Number(cornersSquareOptions?.ringWidthUnits ?? 0.6);
  const innerUnits = Number(cornersDotOptions?.innerUnits ?? (variant === 'ring' ? 1.2 : 1.5));
  for (const [cx, cy] of centers) {
    drawFinderCircle(ctx, cx, cy, pixels, { outer: csColor, inner: cdColor }, bgFill, variant, innerType, bgIsTransparent, ringWidthUnits, innerUnits);
  }

  // Draw logo if provided
  if (image) {
    const ratio = Math.max(0.1, Math.min(0.75, Number(imageOptions.imageSize || 0.35)));
    const logoSize = size * ratio;
    const pad = Number(imageOptions.margin || 2);
    const lx = Math.round(width / 2 - logoSize / 2);
    const ly = Math.round(height / 2 - logoSize / 2);
    if (imageOptions.hideBackgroundDots) {
      // Clear area beneath logo
      if (bgIsTransparent) {
        const prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-out';
        roundRect(ctx, lx - pad, ly - pad, logoSize + pad * 2, logoSize + pad * 2, Math.min(12, logoSize * 0.15));
        ctx.fill();
        ctx.globalCompositeOperation = prev;
      } else {
        ctx.fillStyle = bgFill;
        roundRect(ctx, lx - pad, ly - pad, logoSize + pad * 2, logoSize + pad * 2, Math.min(12, logoSize * 0.15));
        ctx.fill();
      }
    }
    await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, lx, ly, logoSize, logoSize);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = image;
    });
  }

  const bSize = Number(borderOptions.size || 0);
  if (bSize > 0) {
    ctx.strokeStyle = borderOptions.color || "#000000";
    ctx.lineWidth = bSize;
    const radius = Number(borderOptions.radius || 0);
    roundRect(ctx, bSize / 2, bSize / 2, width - bSize, height - bSize, radius);
    ctx.stroke();
  }
}
