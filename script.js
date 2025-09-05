(() => {
  const $ = (sel) => document.querySelector(sel);

  const els = {
    form: $('#qr-form'),
    txt: $('#qr-text'),
    size: $('#qr-size'),
    ecc: $('#qr-ecc'),
    fg: $('#qr-foreground'),
    bg: $('#qr-background'),
    logo: $('#qr-logo'),
    btnGenerate: $('#btn-generate'),
    btnDownload: $('#btn-download'),
    btnClear: $('#btn-clear'),
    container: $('#qr-container'),
    output: $('#qr-output'),
    placeholder: document.querySelector('#qr-container .placeholder'),
    logoPreview: $('#logo-preview'),
    status: $('#status'),
  };

  let qrcode = null;
  let logoDataUrl = null;
  let logoImage = null; // HTMLImageElement once loaded

  function setStatus(msg, type = 'info') {
    els.status.textContent = msg || '';
    els.status.dataset.type = type;
  }

  function ensureLib() {
    if (!window.QRCode || !window.QRCode.CorrectLevel) {
      setStatus('QR library failed to load. Check your internet connection.', 'error');
      return false;
    }
    return true;
  }

  function eccMap(value) {
    const L = window.QRCode?.CorrectLevel?.L;
    const M = window.QRCode?.CorrectLevel?.M;
    const Q = window.QRCode?.CorrectLevel?.Q;
    const H = window.QRCode?.CorrectLevel?.H;
    switch (value) {
      case 'L': return L;
      case 'M': return M;
      case 'Q': return Q;
      case 'H': return H;
      default: return M;
    }
  }

  function getOptions() {
    const text = (els.txt.value || '').trim();
    const size = Math.max(128, Math.min(1024, parseInt(els.size.value || '256', 10)));
    const correctLevel = eccMap(els.ecc.value);
    const colorDark = els.fg.value || '#000000';
    const colorLight = els.bg.value || '#ffffff';
    return { text, size, correctLevel, colorDark, colorLight };
  }

  function clearOutput() {
    els.output.innerHTML = '';
    els.placeholder.style.display = '';
    els.logoPreview.style.display = 'none';
    els.btnDownload.disabled = true;
    qrcode = null;
  }

  function updateLogoPreview(size) {
    if (!logoDataUrl) {
      els.logoPreview.style.display = 'none';
      return;
    }
    const imgSize = Math.round(size * 0.22);
    els.logoPreview.src = logoDataUrl;
    els.logoPreview.style.width = imgSize + 'px';
    els.logoPreview.style.height = imgSize + 'px';
    els.logoPreview.style.display = 'block';
  }

  function generate() {
    if (!ensureLib()) return;
    const { text, size, correctLevel, colorDark, colorLight } = getOptions();
    if (!text) {
      clearOutput();
      setStatus('Enter content to generate a QR code.', 'info');
      return;
    }

    // Reset container and draw
    els.output.innerHTML = '';
    els.placeholder.style.display = 'none';

    qrcode = new window.QRCode(els.output, {
      text,
      width: size,
      height: size,
      colorDark,
      colorLight,
      correctLevel,
    });

    // Update overlay preview if logo provided
    updateLogoPreview(size);
    els.btnDownload.disabled = false;
    setStatus('QR code generated.');
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function downloadPng() {
    if (!qrcode) return;
    const { size, colorLight } = getOptions();

    // Get the underlying canvas created by the library
    const canvas = els.output.querySelector('canvas');
    if (!canvas) {
      setStatus('Unable to access QR canvas. Try regenerating.', 'error');
      return;
    }

    // Compose into an export canvas to add optional logo
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d');

    // Fill background explicitly to ensure solid color
    ctx.fillStyle = colorLight;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(canvas, 0, 0, size, size);

    if (logoImage && logoDataUrl) {
      const logoSize = Math.round(size * 0.22);
      const border = Math.round(logoSize * 0.12);
      const x = Math.round((size - logoSize) / 2);
      const y = Math.round((size - logoSize) / 2);

      // White rounded background under the logo for contrast
      ctx.save();
      drawRoundedRect(ctx, x - border, y - border, logoSize + border * 2, logoSize + border * 2, Math.round((logoSize + border * 2) * 0.12));
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // Clip to rounded rect and draw logo
      ctx.save();
      drawRoundedRect(ctx, x, y, logoSize, logoSize, Math.round(logoSize * 0.12));
      ctx.clip();
      ctx.drawImage(logoImage, x, y, logoSize, logoSize);
      ctx.restore();
    }

    const url = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    const slug = (els.txt.value || 'qr-code').trim().replace(/\s+/g, '-').slice(0, 64) || 'qr-code';
    a.href = url;
    a.download = slug + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function clearAll() {
    els.form.reset();
    logoDataUrl = null;
    logoImage = null;
    clearOutput();
    setStatus('Cleared. Ready to generate a new QR code.');
    els.txt.focus();
  }

  function loadLogo(file) {
    if (!file) {
      logoDataUrl = null;
      logoImage = null;
      updateLogoPreview(parseInt(els.size.value || '256', 10));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      logoDataUrl = reader.result;
      logoImage = new Image();
      logoImage.onload = () => {
        updateLogoPreview(parseInt(els.size.value || '256', 10));
        setStatus('Logo loaded.');
      };
      logoImage.onerror = () => {
        logoDataUrl = null;
        logoImage = null;
        updateLogoPreview(parseInt(els.size.value || '256', 10));
        setStatus('Failed to load logo image.', 'error');
      };
      logoImage.src = logoDataUrl;
    };
    reader.onerror = () => {
      setStatus('Unable to read selected file.', 'error');
    };
    reader.readAsDataURL(file);
  }

  // Wire up events
  document.addEventListener('DOMContentLoaded', () => {
    // If lib missing, warn early
    ensureLib();

    // Live update on typing and option changes
    els.txt.addEventListener('input', generate);
    els.size.addEventListener('input', generate);
    els.ecc.addEventListener('change', generate);
    els.fg.addEventListener('input', generate);
    els.bg.addEventListener('input', generate);
    els.logo.addEventListener('change', (e) => loadLogo(e.target.files?.[0] || null));

    // Buttons
    els.btnGenerate.addEventListener('click', generate);
    els.btnDownload.addEventListener('click', downloadPng);
    els.btnClear.addEventListener('click', clearAll);

    // Initial focus
    els.txt.focus();
  });
})();

