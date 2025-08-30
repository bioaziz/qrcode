# QR Code Generator

Simple, privacy-friendly QR code generator that runs entirely in your browser. Create QR codes for URLs, text, and more. Optionally overlay a logo and download as PNG.

## Features

- Text/URL input with live preview
- Size control (128–1024 px)
- Error correction levels (L/M/Q/H)
- Foreground/background color
- Optional centered logo overlay with white padding
- Download as PNG

## Usage

1. Open `index.html` in your browser (double-click or drag into a tab).
2. Type a URL or any text.
3. Adjust size, colors, and error correction if desired.
4. Optionally choose a logo (PNG/JPG/SVG). It is previewed and applied on export.
5. Click "Download PNG" to save the generated code.

No data is sent to a server; everything happens locally in your browser.

## Notes

- This app uses the lightweight `qrcodejs` library from a CDN. If you are offline or behind a firewall, the UI will show a message that the library could not load.
- When adding a logo, prefer a simple square logo for best scanning reliability. Larger logos cover more modules and can reduce readability — consider using higher error correction (Q or H) if adding a logo.

## Development

Just edit the files and refresh the browser. No build step is required.

