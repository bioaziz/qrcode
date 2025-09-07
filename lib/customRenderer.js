import QRCode from 'qrcode';

// Deprecated: prefer qr-code-styling for base QR and use renderOverlay for borders
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
    const moduleSize = Math.min(width, height) / totalSize;
    const qrSize = moduleCount * moduleSize;
    const startX = (width - qrSize) / 2;
    const startY = (height - qrSize) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    let outerBorderWidth = borderOptions.outerBorderWidth ?? moduleSize;
    let innerBorderWidth = borderOptions.innerBorderWidth ?? moduleSize;
    let outerRadius = 0;
    let innerRadius = 0;
    if (needsCircularBorder) {
        outerRadius = borderOptions.outerRadius || (Math.min(width, height) / 2 - outerBorderWidth / 2);
        innerRadius = borderOptions.innerRadius || (qrSize / 2 + moduleSize * 4);
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
        const quietZonePx = quietZone * moduleSize;
        const qrStartX = startX - quietZonePx;
        const qrStartY = startY - quietZonePx;
        const trueQrSize = qrSize + quietZonePx * 2;
        const patternRadius = innerRadius - innerBorderWidth / 2;

        drawCircularPattern(ctx, centerX, centerY, patternRadius, {
            patternColor: borderOptions.patternColor || '#f0f0f0',
            moduleSize,
            type: dotType,
            qrStartX,
            qrStartY,
            qrSize: trueQrSize,
        });

        // Fill ring background between inner and outer radii
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
        ctx.fillStyle = borderOptions.ringBackgroundColor || backgroundFill || '#ffffff';
        ctx.fill();

        // Stroke outer and inner circles to define ring
        ctx.lineWidth = outerBorderWidth;
        ctx.strokeStyle = borderOptions.outerBorderColor || borderOptions.ringBackgroundColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = innerBorderWidth;
        ctx.strokeStyle = borderOptions.innerBorderColor || borderOptions.ringBackgroundColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.stroke();

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

            const px = startX + x * moduleSize;
            const py = startY + y * moduleSize;

            // Skip corner squares (we'll draw them separately)
            if (isInCornerSquare(x, y, cornerPositions)) continue;

            const neigh = {
                top: y > 0 && modules.get(x, y - 1),
                right: x < moduleCount - 1 && modules.get(x + 1, y),
                bottom: y < moduleCount - 1 && modules.get(x, y + 1),
                left: x > 0 && modules.get(x - 1, y),
            };

            drawModule(ctx, px, py, moduleSize, dotFillStyle, dotType, neigh);
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

// Draw only overlay elements (e.g., circular border ring or circular eyes) on top of a base QR rendered by qr-code-styling.
// It does not render the QR modules, preserving the library's visual for dots and data modules.
export async function renderOverlay(canvas, options) {
    const {
        width = 5000,
        height = 5000,
        backgroundOptions = {},
        dotsOptions = {},
        cornersSquareOptions = {},
        cornersDotOptions = {},
        borderOptions = {},
        qrOptions = {},
        data = 'https://',
    } = options || {};

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;

    // Recreate QR matrix to align overlay precisely
    const qr = QRCode.create(data, {
        errorCorrectionLevel: qrOptions.errorCorrectionLevel || 'M',
        margin: 0,
    });
    const modules = qr.modules;
    const moduleCount = modules.size;
    const quietZone = qrOptions.margin ?? 4;

    const totalSize = moduleCount + quietZone * 2;
    const baseSize = Math.min(width, height);
    const moduleSize = baseSize / totalSize;
    const qrSize = moduleCount * moduleSize;
    const quietZonePx = quietZone * moduleSize;

    const outerBorderWidth = borderOptions.outerBorderWidth ?? moduleSize;
    const innerBorderWidth = borderOptions.innerBorderWidth ?? moduleSize;
    let innerRadius = borderOptions.innerRadius || (
        qrSize / 2 + quietZonePx + innerBorderWidth / 2
    );
    let outerRadius = borderOptions.outerRadius || (
        innerRadius + quietZonePx + innerBorderWidth / 2 + outerBorderWidth / 2
    );

    if (outerRadius <= innerRadius) {
        outerRadius = innerRadius + outerBorderWidth + 1;
    }

    const requiredHalf = outerRadius + outerBorderWidth / 2;
    const requiredSize = Math.max(width, height, requiredHalf * 2);

    canvas.width = requiredSize * dpr;
    canvas.height = requiredSize * dpr;
    canvas.style.width = `${requiredSize}px`;
    canvas.style.height = `${requiredSize}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, requiredSize, requiredSize);

    const centerX = requiredSize / 2;
    const centerY = requiredSize / 2;
    const startX = (requiredSize - qrSize) / 2;
    const startY = (requiredSize - qrSize) / 2;

    // Prepare background fill (used to mask base finders if needed)
    let backgroundFill = null;
    if (backgroundOptions.gradient) {
        backgroundFill = createGradient(
            ctx,
            requiredSize,
            requiredSize,
            backgroundOptions.gradient
        );
    } else if (backgroundOptions.color && backgroundOptions.color !== 'transparent') {
        backgroundFill = backgroundOptions.color;
    }

    // Circular border overlay (ring, pattern, text, logo)
    if (borderOptions?.circularBorder) {
        const quietZonePx = quietZone * moduleSize;
        const qrStartX = startX - quietZonePx;
        const qrStartY = startY - quietZonePx;
        const trueQrSize = qrSize + quietZonePx * 2;
        const patternRadius = innerRadius - innerBorderWidth / 2;

        drawCircularPattern(ctx, centerX, centerY, patternRadius, {

            patternColor: borderOptions.patternColor || '#f0f0f0',
            moduleSize,
            type: dotsOptions.type || 'square',
            qrStartX,
            qrStartY,
            qrSize: trueQrSize,
        });

        // Fill ring background between inner and outer
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
        ctx.fillStyle = borderOptions.ringBackgroundColor || backgroundFill || '#ffffff';
        ctx.fill();

        // Stroke outer and inner rings
        ctx.lineWidth = outerBorderWidth;
        ctx.strokeStyle = borderOptions.outerBorderColor || borderOptions.ringBackgroundColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = innerBorderWidth;
        ctx.strokeStyle = borderOptions.innerBorderColor || borderOptions.ringBackgroundColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Text
        const textRadius = (outerRadius + innerRadius) / 2;
        const text = borderOptions.borderText || '';
        if (text) {
            drawCircularText(ctx, centerX, centerY, textRadius, {
                text,
                color: borderOptions.borderTextColor || '#333333',
                font: borderOptions.borderFont || 'Arial',
                fontSize: borderOptions.borderFontSize || 14,
            });
        }
        // Logo
        if (borderOptions.borderLogo) {
            await drawBorderLogo(ctx, centerX, centerY, textRadius, {
                logoUrl: borderOptions.borderLogo,
                logoSize: borderOptions.borderLogoSize || 24,
                logoAngle: borderOptions.borderLogoAngle || 0,
            });
        }
    }

    // Circular eyes overlay: mask base finders and draw circular eyes on top
    if (cornersSquareOptions?.type === 'circle') {
        const cornerPositions = [
            {x: 0, y: 0},
            {x: moduleCount - 7, y: 0},
            {x: 0, y: moduleCount - 7},
        ];
        const squareColor = cornersSquareOptions.color || '#000000';
        const dotColor = cornersDotOptions.color || '#000000';
        const dotType = cornersDotOptions.type || 'dot';

        cornerPositions.forEach((corner) => {
            const px = startX + corner.x * moduleSize;
            const py = startY + corner.y * moduleSize;
            const size = moduleSize * 7;
            // Mask base finder by painting background over its area
            ctx.save();
            if (backgroundFill) {
                ctx.fillStyle = backgroundFill;
                ctx.fillRect(px, py, size, size);
            } else {
                ctx.clearRect(px, py, size, size);
            }
            ctx.restore();

            // Draw circular finder on top
            drawCircleCorner(ctx, px, py, moduleSize, squareColor, dotColor, dotType);
        });
    }
}

function drawCircularPattern(ctx, centerX, centerY, radius, options) {
    const { patternColor, moduleSize, type, qrStartX, qrStartY, qrSize } = options;

    const innerSquareStartX = qrStartX;
    const innerSquareStartY = qrStartY;
    const innerSquareSize = qrSize;

    const outerR = radius;
    if (outerR <= innerSquareSize / 2) return;

    const extra = Math.ceil((outerR - innerSquareSize / 2) / moduleSize);
    const startX = innerSquareStartX - extra * moduleSize;
    const startY = innerSquareStartY - extra * moduleSize;
    const endX = innerSquareStartX + innerSquareSize + extra * moduleSize;
    const endY = innerSquareStartY + innerSquareSize + extra * moduleSize;

    for (let y = startY; y < endY; y += moduleSize) {
        for (let x = startX; x < endX; x += moduleSize) {
            const cx = x + moduleSize / 2;
            const cy = y + moduleSize / 2;
            const dx = cx - centerX;
            const dy = cy - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const inSquare =
                x >= innerSquareStartX &&
                x < innerSquareStartX + innerSquareSize &&
                y >= innerSquareStartY &&
                y < innerSquareStartY + innerSquareSize;

            if (dist <= outerR && !inSquare) {
                drawModule(ctx, x, y, moduleSize, patternColor, type);
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

function drawModule(ctx, x, y, size, color, type, neighbors = { top: false, right: false, bottom: false, left: false }) {
    ctx.fillStyle = color;

    const t = String(type);
    if (t === 'square') {
        ctx.fillRect(x, y, size, size);
        return;
    }

    if (t === 'dots') {
        // qr-code-styling dots.ts uses r = size * 0.4
        const r = size * 0.4;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, r, 0, 2 * Math.PI);
        ctx.fill();
        return;
    }

    if (t === 'rounded') {
        // inset and radius per qr-code-styling rounded.ts (inset = size * 0.06)
        const inset = size * 0.06;
        const inner = size - inset * 2;
        // Per-corner radius depending on neighbors; round only at external corners
        const base = inner * 0.5; // quarter-circle corners when isolated
        const tl = (!neighbors.top && !neighbors.left) ? base : 0;
        const tr = (!neighbors.top && !neighbors.right) ? base : 0;
        const br = (!neighbors.bottom && !neighbors.right) ? base : 0;
        const bl = (!neighbors.bottom && !neighbors.left) ? base : 0;
        drawRectWithRadii(ctx, x + inset, y + inset, inner, inner, { tl, tr, br, bl });
        return;
    }

    if (t === 'classy') {
        // inset = size * 0.06, radii from qr-code-styling classy.ts
        const inset = size * 0.06;
        const inner = size - inset * 2;
        // Asymmetric radii; zero-out when adjacent to neighbors
        const large = inner * 0.5;
        const small = inner * 0.2;
        const tl = (!neighbors.top && !neighbors.left) ? large : 0;
        const tr = (!neighbors.top && !neighbors.right) ? small : 0;
        const br = (!neighbors.bottom && !neighbors.right) ? large : 0;
        const bl = (!neighbors.bottom && !neighbors.left) ? small : 0;
        drawRectWithRadii(ctx, x + inset, y + inset, inner, inner, { tl, tr, br, bl });
        return;
    }

    // Fallback
    ctx.fillRect(x, y, size, size);
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

function drawRectWithRadii(ctx, x, y, width, height, radii) {
    const tl = Math.max(0, radii.tl || 0);
    const tr = Math.max(0, radii.tr || 0);
    const br = Math.max(0, radii.br || 0);
    const bl = Math.max(0, radii.bl || 0);
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + width - tr, y);
    ctx.arcTo(x + width, y, x + width, y + tr, tr);
    ctx.lineTo(x + width, y + height - br);
    ctx.arcTo(x + width, y + height, x + width - br, y + height, br);
    ctx.lineTo(x + bl, y + height);
    ctx.arcTo(x, y + height, x, y + height - bl, bl);
    ctx.lineTo(x, y + tl);
    ctx.arcTo(x, y, x + tl, y, tl);
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
