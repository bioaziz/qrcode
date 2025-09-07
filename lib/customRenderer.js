import QRCode from 'qrcode';

export async function renderCustomQR(canvas, options) {
    const {
        width = 5000,
        height = 5000,
        data = 'https://',
        backgroundOptions = {},
        dotsOptions = {},
        cornersSquareOptions = {},
        cornersDotOptions = {},
        borderOptions = {},
        imageOptions = {},
        qrOptions = {},
        image
    } = options;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    // Improve rendering crispness
    ctx.imageSmoothingEnabled = false;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    const snap = (v) => Math.round(v * dpr) / dpr;

    // Generate QR code matrix
    const qr = QRCode.create(data, {
        errorCorrectionLevel: qrOptions.errorCorrectionLevel || 'M',
        margin: 0, // We'll handle margin ourselves
    });

    const modules = qr.modules;
    const moduleCount = modules.size;
    const quietZone = qrOptions.margin ?? 4;

    // Determine if circular border is enabled before sizing
    const needsCircularBorder = borderOptions?.circularBorder;
    const padding = needsCircularBorder ? Math.max(quietZone * 4, 16) : quietZone;

    // Calculate dimensions with additional padding for circular mode
    const totalSize = moduleCount + padding * 2;
    const rawModuleSize = Math.min(width, height) / totalSize;
    const moduleSize = Math.max(1 / dpr, Math.floor(rawModuleSize * dpr) / dpr);
    const qrSize = moduleCount * moduleSize;
    const startX = snap((width - qrSize) / 2);
    const startY = snap((height - qrSize) / 2);
    const centerX = snap(width / 2);
    const centerY = snap(height / 2);

    let outerBorderWidth = borderOptions.outerBorderWidth ?? moduleSize;
    let innerBorderWidth = borderOptions.innerBorderWidth ?? moduleSize;
    let outerRadius = 0;
    let innerRadius = 0;
    if (needsCircularBorder) {
        // Compute a safe minimum inner radius: half of the QR square diagonal plus half the inner stroke width
        const qrHalfDiagonal = qrSize / Math.SQRT2; // = (sqrt(2) * qrSize) / 2
        const minInnerRadius = qrHalfDiagonal + (innerBorderWidth / 2);

        // Resolve requested radii and clamp innerRadius to avoid overlapping the QR
        const requestedOuter = borderOptions.outerRadius;
        const requestedInner = borderOptions.innerRadius;

        // Snap widths and radii to device pixels
        outerBorderWidth = snap(outerBorderWidth);
        innerBorderWidth = snap(innerBorderWidth);
        const maxOuterRadius = snap((Math.min(width, height) / 2) - (outerBorderWidth / 2));
        outerRadius = (requestedOuter != null && requestedOuter > 0)
            ? Math.min(snap(requestedOuter), maxOuterRadius)
            : maxOuterRadius;

        const fallbackInner = qrSize / 2 + moduleSize * 4;
        innerRadius = (requestedInner != null && requestedInner > 0)
            ? Math.max(snap(requestedInner), minInnerRadius)
            : Math.max(snap(fallbackInner), minInnerRadius);

        // Ensure outer radius stays outside inner radius accounting for half stroke widths on both rings
        const minOuterRadius = innerRadius + (innerBorderWidth / 2) + (outerBorderWidth / 2);
        outerRadius = Math.max(outerRadius, snap(minOuterRadius));
        // Re-apply ceiling clamp
        outerRadius = Math.min(outerRadius, maxOuterRadius);
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Prepare background fill (color or gradient) limited to QR or circular border
    let backgroundFill = null;
    if (backgroundOptions.gradient) {
        backgroundFill = createGradient(ctx, width, height, backgroundOptions.gradient);
    } else if (backgroundOptions.color && backgroundOptions.color !== 'transparent') {
        backgroundFill = backgroundOptions.color;
    }
    if (backgroundFill) {
        ctx.save();
        ctx.fillStyle = backgroundFill;
        if (needsCircularBorder) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
            ctx.clip();
            ctx.fillRect(centerX - outerRadius, centerY - outerRadius, outerRadius * 2, outerRadius * 2);
        } else {
            ctx.fillRect(startX, startY, qrSize, qrSize);
        }
        ctx.restore();
    }

    const dotType = dotsOptions.type || 'square';
    const dotColor = dotsOptions.color || '#000000';
    let dotFillStyle = dotsOptions.gradient
        ? createGradient(ctx, width, height, dotsOptions.gradient)
        : dotColor;

    if (needsCircularBorder) {
        // Fill area outside QR but inside innerRadius with random pattern
        drawCircularPattern(ctx, centerX, centerY, innerRadius, qrSize / 2, {
            patternColor: borderOptions.patternColor || '#f0f0f0',
            moduleSize,
            type: borderOptions.borderDotType || dotType
        });

        // Fill ring background between inner and outer radii (even-odd fill avoids stroke blur)
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
        ctx.fillStyle = borderOptions.ringBackgroundColor || backgroundFill || '#ffffff';
        if (typeof ctx.fill === 'function') ctx.fill('evenodd'); else ctx.fill();

        // Paint outer border as a filled ring
        if (outerBorderWidth > 0) {
            const rOuterA = outerRadius + outerBorderWidth / 2;
            const rOuterB = Math.max(outerRadius - outerBorderWidth / 2, 0);
            ctx.beginPath();
            ctx.arc(centerX, centerY, rOuterA, 0, 2 * Math.PI);
            ctx.arc(centerX, centerY, rOuterB, 0, 2 * Math.PI, true);
            ctx.fillStyle = borderOptions.outerBorderColor || borderOptions.ringBackgroundColor || '#ffffff';
            if (typeof ctx.fill === 'function') ctx.fill('evenodd'); else ctx.fill();
        }
        // Paint inner border as a filled ring
        if (innerBorderWidth > 0) {
            const rInnerA = innerRadius + innerBorderWidth / 2;
            const rInnerB = Math.max(innerRadius - innerBorderWidth / 2, 0);
            ctx.beginPath();
            ctx.arc(centerX, centerY, rInnerA, 0, 2 * Math.PI);
            ctx.arc(centerX, centerY, rInnerB, 0, 2 * Math.PI, true);
            ctx.fillStyle = borderOptions.innerBorderColor || borderOptions.ringBackgroundColor || '#ffffff';
            if (typeof ctx.fill === 'function') ctx.fill('evenodd'); else ctx.fill();
        }

        // Draw border text midway through ring
        const textRadius = (outerRadius + innerRadius) / 2;
        const text = borderOptions.borderText || 'Scan me';
        if (text) {
            drawCircularText(ctx, centerX, centerY, textRadius, {
                text,
                color: borderOptions.borderTextColor || '#333333',
                font: borderOptions.borderFont || 'Arial',
                fontSize: borderOptions.borderFontSize || 14
            });
        }

        // Draw border logo at same radius as text
        if (borderOptions.borderLogo) {
            await drawBorderLogo(ctx, centerX, centerY, textRadius, {
                logoUrl: borderOptions.borderLogo,
                logoSize: borderOptions.borderLogoSize || 24,
                logoAngle: borderOptions.borderLogoAngle || 0
            });
        }
    }

    // Draw QR modules
    
    // Find corner positions for special handling
    const cornerPositions = [
        {x: 0, y: 0}, // Top-left
        {x: moduleCount - 7, y: 0}, // Top-right
        {x: 0, y: moduleCount - 7} // Bottom-left
    ];

    for (let y = 0; y < moduleCount; y++) {
        for (let x = 0; x < moduleCount; x++) {
            if (!modules.get(x, y)) continue;

            const px = Math.round((startX + x * moduleSize) * dpr) / dpr;
            const py = Math.round((startY + y * moduleSize) * dpr) / dpr;

            // Skip corner squares (we'll draw them separately)
            if (isInCornerSquare(x, y, cornerPositions)) continue;

            drawModule(ctx, px, py, moduleSize, dotFillStyle, dotType, dpr);
        }
    }

    // Draw corner squares with special handling for circles
    const cornerSquareType = cornersSquareOptions.type || 'square';
    const cornerSquareColor = cornersSquareOptions.color || '#000000';
    const cornerDotColor = cornersDotOptions.color || '#000000';
    const cornerDotType = cornersDotOptions.type || 'dot';

    cornerPositions.forEach(corner => {
        const px = startX + corner.x * moduleSize;
        const py = startY + corner.y * moduleSize;
        if (cornerSquareType === 'circle') {
            drawCircleCorner(ctx, px, py, moduleSize, cornerSquareColor, cornerDotColor, cornerDotType);
        } else {
            drawSquareCorner(
                ctx,
                px,
                py,
                moduleSize,
                cornerSquareColor,
                cornerDotColor,
                cornerSquareType,
                cornerDotType,
                backgroundFill
            );
        }
    });

    // Draw center logo if provided
    if (image && imageOptions) {
        await drawCenterLogo(ctx, width / 2, height / 2, image, imageOptions, qrSize);
    }
}

function drawCircularPattern(ctx, centerX, centerY, innerRadius, qrRadius, options) {

    const { patternColor, moduleSize, type } = options;

    ctx.fillStyle = patternColor;

    // Iterate over a square grid covering the inner radius
    const step = moduleSize;
    const startX = centerX - innerRadius;
    const startY = centerY - innerRadius;
    const endX = centerX + innerRadius;
    const endY = centerY + innerRadius;


    for (let y = startY; y < endY; y += step) {
        for (let x = startX; x < endX; x += step) {
            const cx = x + step / 2;
            const cy = y + step / 2;
            const dx = cx - centerX;
            const dy = cy - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const qrHalfSize = qrRadius;
            const inSquare = Math.abs(dx) <= qrHalfSize && Math.abs(dy) <= qrHalfSize;

            // Only draw within the pattern ring, outside the QR square, and with some randomness
            if (dist < innerRadius && !inSquare && Math.random() > 0.6) {

                switch (type) {
                    case 'dots':
                        ctx.beginPath();
                        ctx.arc(cx, cy, step / 3, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case 'rounded':
                        drawRoundedRect(ctx, cx - step / 2, cy - step / 2, step, step, step / 4);
                        break;
                    default:
                        ctx.fillRect(cx - step / 2, cy - step / 2, step, step);
                }
            }
        }
    }
}

function drawCircularText(ctx, centerX, centerY, radius, options) {
    const { text, color, font, fontSize } = options;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const chars = (text || '').split('');
    const widths = chars.map(ch => ctx.measureText(ch).width);
    const totalWidth = widths.reduce((a, b) => a + b, 0);

    let currentAngle = -Math.PI / 2 - (totalWidth / 2) / radius;
    chars.forEach((char, i) => {
        const w = widths[i];
        const angle = currentAngle + w / (2 * radius);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(char, 0, 0);
        ctx.restore();
        currentAngle += w / radius;

    });
}

async function drawBorderLogo(ctx, centerX, centerY, radius, options) {
    const { logoUrl, logoSize, logoAngle } = options;
    
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const angle = logoAngle * Math.PI / 180;
            const x = centerX + Math.cos(angle) * (radius - logoSize / 2);
            const y = centerY + Math.sin(angle) * (radius - logoSize / 2);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.drawImage(img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
            ctx.restore();
            resolve();
        };
        img.onerror = () => resolve();
        img.src = logoUrl;
    });
}

async function drawCenterLogo(ctx, centerX, centerY, imageUrl, imageOptions, qrSize) {
    const { imageSize = 0.35, hideBackgroundDots = false } = imageOptions;
    const logoSize = qrSize * imageSize;
    
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Clear background if needed
            if (hideBackgroundDots) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
            }
            
            ctx.drawImage(img, 
                centerX - logoSize / 2, 
                centerY - logoSize / 2, 
                logoSize, 
                logoSize
            );
            resolve();
        };
        img.onerror = () => resolve();
        img.src = imageUrl;
    });
}

function drawModule(ctx, x, y, size, color, type, dpr = (window && window.devicePixelRatio) || 1) {
    ctx.fillStyle = color;

    switch (type) {
        case 'dots':
            // Snap circle center and radius to device pixels to reduce AA
            const cx = Math.round((x + size / 2) * dpr) / dpr;
            const cy = Math.round((y + size / 2) * dpr) / dpr;
            const rRaw = size / 3;
            const r = Math.max(0, Math.floor(rRaw * dpr) / dpr);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'rounded':
            // Snap rectangle bounds and radius
            const rx = Math.round(x * dpr) / dpr;
            const ry = Math.round(y * dpr) / dpr;
            const rw = Math.round(size * dpr) / dpr;
            const rh = Math.round(size * dpr) / dpr;
            const rr = Math.max(0, Math.floor((size / 4) * dpr) / dpr);
            drawRoundedRectCrisp(ctx, rx, ry, rw, rh, rr, dpr);
            break;
        default:
            ctx.fillRect(x, y, size, size);
    }
}

function drawRoundedRectCrisp(ctx, x, y, width, height, radius, dpr) {
    // Ensure radius does not exceed half of width/height
    const r = Math.min(radius, width / 2, height / 2);
    // Snap key points
    const x0 = Math.round(x * dpr) / dpr;
    const y0 = Math.round(y * dpr) / dpr;
    const x1 = Math.round((x + width) * dpr) / dpr;
    const y1 = Math.round((y + height) * dpr) / dpr;
    const rr = Math.round(r * dpr) / dpr;
    ctx.beginPath();
    ctx.moveTo(x0 + rr, y0);
    ctx.lineTo(x1 - rr, y0);
    ctx.arcTo(x1, y0, x1, y0 + rr, rr);
    ctx.lineTo(x1, y1 - rr);
    ctx.arcTo(x1, y1, x1 - rr, y1, rr);
    ctx.lineTo(x0 + rr, y1);
    ctx.arcTo(x0, y1, x0, y1 - rr, rr);
    ctx.lineTo(x0, y0 + rr);
    ctx.arcTo(x0, y0, x0 + rr, y0, rr);
    ctx.closePath();
    ctx.fill();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
}

function drawCircleCorner(ctx, x, y, moduleSize, squareColor, dotColor, dotType) {
    const size = moduleSize * 7;
    const center = size / 2;

    // Draw outer ring
    ctx.strokeStyle = squareColor;
    ctx.lineWidth = moduleSize;
    ctx.beginPath();
    ctx.arc(x + center, y + center, center - moduleSize / 2, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw inner dot or square
    ctx.fillStyle = dotColor;
    if (dotType === 'square') {
        const dotSize = moduleSize * 3;
        const dotOffset = center - dotSize / 2;
        ctx.fillRect(x + dotOffset, y + dotOffset, dotSize, dotSize);
    } else {
        ctx.beginPath();
        ctx.arc(x + center, y + center, moduleSize * 1.5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawSquareCorner(ctx, x, y, moduleSize, squareColor, dotColor, type, dotType, backgroundFill) {
    const size = moduleSize * 7;

    // Draw outer square
    ctx.fillStyle = squareColor;
    if (type === 'extra-rounded') {
        drawRoundedRect(ctx, x, y, size, size, moduleSize);
    } else {
        ctx.fillRect(x, y, size, size);
    }

    // Carve out inner area with background fill or transparency
    if (type === 'extra-rounded') {
        if (backgroundFill) {
            ctx.fillStyle = backgroundFill;
            drawRoundedRect(
                ctx,
                x + moduleSize,
                y + moduleSize,
                size - 2 * moduleSize,
                size - 2 * moduleSize,
                moduleSize / 2
            );
        } else {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            drawRoundedRect(
                ctx,
                x + moduleSize,
                y + moduleSize,
                size - 2 * moduleSize,
                size - 2 * moduleSize,
                moduleSize / 2
            );
            ctx.restore();
        }
    } else {
        if (backgroundFill) {
            ctx.fillStyle = backgroundFill;
            ctx.fillRect(
                x + moduleSize,
                y + moduleSize,
                size - 2 * moduleSize,
                size - 2 * moduleSize
            );
        } else {
            ctx.clearRect(
                x + moduleSize,
                y + moduleSize,
                size - 2 * moduleSize,
                size - 2 * moduleSize
            );
        }
    }

    // Draw center dot or square
    ctx.fillStyle = dotColor;
    const dotSize = moduleSize * 3;
    const dotOffset = moduleSize * 2;
    if (dotType === 'square') {
        ctx.fillRect(x + dotOffset, y + dotOffset, dotSize, dotSize);
    } else {
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, dotSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function isInCornerSquare(x, y, cornerPositions) {
    for (const corner of cornerPositions) {
        if (x >= corner.x && x < corner.x + 7 && y >= corner.y && y < corner.y + 7) {
            return true;
        }
    }
    return false;
}

function createGradient(ctx, width, height, grad) {
    const { type = 'linear', rotation = 0, colorStops = [] } = grad || {};
    let g;
    if (type === 'radial') {
        const r = Math.sqrt(width * width + height * height) / 2;
        g = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, r);
    } else {
        const diag = Math.sqrt(width * width + height * height);
        const angle = rotation;
        const x0 = width / 2 + Math.cos(angle + Math.PI) * diag / 2;
        const y0 = height / 2 + Math.sin(angle + Math.PI) * diag / 2;
        const x1 = width / 2 + Math.cos(angle) * diag / 2;
        const y1 = height / 2 + Math.sin(angle) * diag / 2;
        g = ctx.createLinearGradient(x0, y0, x1, y1);
    }
    colorStops.forEach(({ offset, color }) => g.addColorStop(offset, color));
    return g;
}
