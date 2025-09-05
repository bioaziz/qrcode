import QRCode from 'qrcode';

export async function renderCustomQR(canvas, options) {
    const {
        width = 256,
        height = 256,
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

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const dotType = dotsOptions.type || 'square';
    const dotColor = dotsOptions.color || '#000000';

    let outerRadius = 0;
    let innerRadius = 0;
    const centerX = width / 2;
    const centerY = height / 2;

    if (needsCircularBorder) {
        const strokeWidth = moduleSize;
        outerRadius = Math.min(width, height) / 2 - strokeWidth / 2;
        innerRadius = qrSize / 2 + strokeWidth * 2;

        // Fill ring with random pattern matching module style
        drawCircularPattern(ctx, centerX, centerY, outerRadius - strokeWidth / 2, innerRadius + strokeWidth / 2, {
            patternColor: borderOptions.patternColor || '#f0f0f0',
            moduleSize,
            type: dotType
        });

        // Stroke outer and inner circles to define ring
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = borderOptions.borderTextColor || '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.stroke();
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

    // Draw background
    if (!backgroundOptions.color || backgroundOptions.color !== 'transparent') {
        const bgColor = backgroundOptions.color || '#ffffff';

        if (needsCircularBorder) {
            // Circular background for QR area
            const strokeWidth = moduleSize;
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius - strokeWidth / 2, 0, 2 * Math.PI);

            ctx.fillStyle = bgColor;
            ctx.fill();
        } else {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
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

            drawModule(ctx, px, py, moduleSize, dotColor, dotType);
        }
    }

    // Draw corner squares with special handling for circles
    const cornerSquareType = cornersSquareOptions.type || 'square';
    const cornerSquareColor = cornersSquareOptions.color || '#000000';
    const cornerDotColor = cornersDotOptions.color || '#000000';

    cornerPositions.forEach(corner => {
        if (cornerSquareType === 'circle') {
            drawCircleCorner(ctx, 
                startX + corner.x * moduleSize, 
                startY + corner.y * moduleSize, 
                moduleSize, 
                cornerSquareColor, 
                cornerDotColor
            );
        } else {
            drawStandardCorner(ctx, 
                startX + corner.x * moduleSize, 
                startY + corner.y * moduleSize, 
                moduleSize, 
                cornerSquareColor, 
                cornerDotColor,
                cornerSquareType
            );
        }
    });

    // Draw center logo if provided
    if (image && imageOptions) {
        await drawCenterLogo(ctx, width / 2, height / 2, image, imageOptions, qrSize);
    }
}

function drawCircularPattern(ctx, centerX, centerY, outerRadius, innerRadius, options) {
    const { patternColor, moduleSize, type } = options;

    ctx.fillStyle = patternColor;

    // Iterate over a square grid covering the outer circle
    const step = moduleSize;
    const startX = centerX - outerRadius;
    const startY = centerY - outerRadius;
    const endX = centerX + outerRadius;
    const endY = centerY + outerRadius;

    for (let y = startY; y < endY; y += step) {
        for (let x = startX; x < endX; x += step) {
            const cx = x + step / 2;
            const cy = y + step / 2;
            const dx = cx - centerX;
            const dy = cy - centerY;

            const dist = Math.sqrt(dx * dx + dy * dy);

            // Only draw within the ring and with some randomness
            if (dist > innerRadius && dist < outerRadius && Math.random() > 0.6) {
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

function drawModule(ctx, x, y, size, color, type) {
    ctx.fillStyle = color;
    
    switch (type) {
        case 'dots':
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 3, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'rounded':
            drawRoundedRect(ctx, x, y, size, size, size / 4);
            break;
        default:
            ctx.fillRect(x, y, size, size);
    }
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

function drawCircleCorner(ctx, x, y, moduleSize, squareColor, dotColor) {
    const size = moduleSize * 7;
    const center = size / 2;
    
    // Draw outer ring
    ctx.strokeStyle = squareColor;
    ctx.lineWidth = moduleSize;
    ctx.beginPath();
    ctx.arc(x + center, y + center, center - moduleSize / 2, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw inner dot
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x + center, y + center, moduleSize * 1.5, 0, 2 * Math.PI);
    ctx.fill();
}

function drawStandardCorner(ctx, x, y, moduleSize, squareColor, dotColor, type) {
    const size = moduleSize * 7;
    
    // Draw outer square
    ctx.fillStyle = squareColor;
    if (type === 'extra-rounded') {
        drawRoundedRect(ctx, x, y, size, size, moduleSize);
    } else {
        ctx.fillRect(x, y, size, size);
    }
    
    // Draw inner white area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, size - 2 * moduleSize, size - 2 * moduleSize);
    
    // Draw center dot
    ctx.fillStyle = dotColor;
    const dotSize = moduleSize * 3;
    const dotOffset = moduleSize * 2;
    ctx.fillRect(x + dotOffset, y + dotOffset, dotSize, dotSize);
}

function isInCornerSquare(x, y, cornerPositions) {
    for (const corner of cornerPositions) {
        if (x >= corner.x && x < corner.x + 7 && y >= corner.y && y < corner.y + 7) {
            return true;
        }
    }
    return false;
}
