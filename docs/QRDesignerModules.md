# QR Designer Modules

This document describes the modules that power the QR Code Designer. Each section outlines the purpose of a module along with the key variables (props or state) and helper functions it exposes.

## pages/designer.js
Purpose: Next.js page that secures a user session and renders the designer.
- **DesignerPage**: React component that loads global fonts and mounts `<QRDesigner />`.
- **getServerSideProps**: Ensures an authenticated session and preloads translations before rendering.

## components/QRDesigner.jsx
Purpose: Orchestrates the designer UI, manages state for all design options and renders a live preview.

### State Variables
#### Content Fields
- `mode` – selected preset such as `freeform`, `link`, `phone`, `email`, `wifi`, `mecard`, or `vcard`.
- `data`, `linkUrl`, `phone`, `email`, `emailSubject`, `emailBody` – payload fields for different presets.
- `wifiSsid`, `wifiPass`, `wifiHidden`, `wifiType` – Wi‑Fi credentials.
- `firstName`, `lastName`, `contactPhone`, `contactEmail`, `org`, `url`, `note`, `street`, `city`, `state`, `zip`, `country` – contact card fields.

#### Style Options
- `size` – canvas width/height in pixels.
- `quietZone` – margin around QR modules.
- `errorCorrection` – error correction level (`L`, `M`, `Q`, `H`).
- `dotType`, `dotColor` – shape and color of QR modules.
- `dotGradEnabled`, `dotGradType`, `dotGradStart`, `dotGradMid`, `dotGradEnd`, `dotGradStops`, `dotGradRotation` – gradient settings for modules.
- `bgColor`, `bgTransparent` – background color or transparency.
- `bgGradEnabled`, `bgGradType`, `bgGradStart`, `bgGradMid`, `bgGradEnd`, `bgGradStops`, `bgGradRotation` – background gradient configuration.

#### Corner Options
- `cornerSquareType`, `cornerSquareColor` – style of outer corner squares.
- `cornerDotType`, `cornerDotColor` – style of inner corner dots.

#### Border Options
- `circularBorder` – toggle for decorative ring.
- `borderText`, `borderTextColor`, `borderFont`, `borderFontSize` – text displayed on the ring.
- `patternColor`, `ringWidth`, `radiusOffset` – geometric properties of the border.
- `borderLogo`, `borderLogoSize`, `borderLogoAngle` – optional logo placed on the ring.

#### Logo Options
- `imageUrl`, `imageSize`, `hideLogoBgDots` – center logo and its rendering behavior.

#### Preset Management
- `savedPresets`, `presetName`, `cloudPresets`, `cloudSelectedId` – local and cloud preset state.

### Functions
- `getPngBlob()` – renders the current canvas to a PNG `Blob` using `renderCustomQR`.
- `download(format)` – saves the QR in PNG or SVG format.
- `downloadPDF()` – exports the QR code to a PDF document.
- `autoSaveDesign()` – persists the current design snapshot to the server.
- `buildSnapshot()` / `applySnapshot()` – serialize and restore designer state.
- `persistPresets()` – saves presets to `localStorage`.

## components/qr/ContentTab.jsx
Purpose: Collects the content encoded in the QR code.
### Props
- `mode`, `setMode`
- `data`, `setData`
- `linkUrl`, `setLinkUrl`
- `phone`, `setPhone`
- `email`, `setEmail`, `emailSubject`, `setEmailSubject`, `emailBody`, `setEmailBody`
- `firstName`, `setFirstName`, `lastName`, `setLastName`, `contactPhone`, `setContactPhone`, `contactEmail`, `setContactEmail`, `org`, `setOrg`, `url`, `setUrl`, `note`, `setNote`, `street`, `setStreet`, `city`, `setCity`, `state`, `setState`, `zip`, `setZip`, `country`, `setCountry`
- `wifiSsid`, `setWifiSsid`, `wifiType`, `setWifiType`, `wifiPass`, `setWifiPass`, `wifiHidden`, `setWifiHidden`
- `validation`
- `copyContent`, `copyImage`

### Functions
- `copyContent()` – copies the QR payload text to the clipboard.
- `copyImage()` – copies the rendered QR image.

## components/qr/StyleTab.jsx
Purpose: Adjusts visual styling such as size, error correction, dot shapes and gradients.
### Props
- `size`, `setSize`, `quietZone`, `setQuietZone`
- `errorCorrection`, `setErrorCorrection`
- `dotType`, `setDotType`, `dotColor`, `setDotColor`
- `dotGradEnabled`, `setDotGradEnabled`, `dotGradType`, `setDotGradType`
- `dotGradStart`, `setDotGradStart`, `dotGradMid`, `setDotGradMid`, `dotGradEnd`, `setDotGradEnd`
- `dotGradStops`, `setDotGradStops`, `dotGradRotation`, `setDotGradRotation`
- `bgColor`, `setBgColor`, `bgTransparent`, `setBgTransparent`
- `bgGradEnabled`, `setBgGradEnabled`, `bgGradType`, `setBgGradType`
- `bgGradStart`, `setBgGradStart`, `bgGradMid`, `setBgGradMid`, `bgGradEnd`, `setBgGradEnd`
- `bgGradStops`, `setBgGradStops`, `bgGradRotation`, `setBgGradRotation`
- `dotTypes`

## components/qr/CornersTab.jsx
Purpose: Configures the shapes and colors of QR finder corners.
### Props
- `cornerSquareType`, `setCornerSquareType`
- `cornerSquareColor`, `setCornerSquareColor`
- `cornerDotType`, `setCornerDotType`
- `cornerDotColor`, `setCornerDotColor`
- `cornerSquareTypes`, `cornerDotTypes`

## components/qr/BorderTab.jsx
Purpose: Manages the optional circular border surrounding the QR code.
### Props
- `circularBorder`, `setCircularBorder`
- `patternColor`, `setPatternColor`
- `ringWidth`, `setRingWidth`
- `radiusOffset`, `setRadiusOffset`
- `borderText`, `setBorderText`
- `borderTextColor`, `setBorderTextColor`
- `borderFont`, `setBorderFont`
- `borderFontSize`, `setBorderFontSize`
- `borderLogo`, `setBorderLogo`
- `borderLogoSize`, `setBorderLogoSize`
- `borderLogoAngle`, `setBorderLogoAngle`
- `onBorderLogoUpload`, `onRemoveBorderLogo`

## components/qr/LogoTab.jsx
Purpose: Uploads a center logo and provides download options.
### Props
- `onUpload`, `error`, `imageUrl`, `setImageUrl`
- `imageSize`, `setImageSize`
- `download`, `downloadPDF`

## components/qr/PresetsTab.jsx
Purpose: Saves and loads designer presets from local storage.
### Props
- `presetName`, `setPresetName`
- `savedPresets`
- `selectedPresetId`, `setSelectedPresetId`
- `savePreset`, `loadPreset`, `deletePreset`

## lib/customRenderer.js
Purpose: Canvas renderer used by the designer to draw QR codes with custom styles and borders.
### Key Variables
- `moduleSize`, `qrSize`, `startX`, `startY` – geometry values derived from QR matrix.
- `centerX`, `centerY` – canvas center coordinates.
- `outerRadius`, `innerRadius` – radii for the circular border.
- `textRadius` – radius for border text positioned within the ring.
### Functions
- `renderCustomQR(canvas, options)` – main entry that draws the QR code, optional border, and logo.
- `drawCircularPattern(ctx, cx, cy, outerR, innerR, opts)` – fills the border ring with a repeating pattern.
- `drawCircularText(ctx, cx, cy, radius, opts)` – renders text along the circular border.
- `drawBorderLogo(ctx, cx, cy, radius, opts)` – places a logo somewhere on the border ring.
- `drawCenterLogo(ctx, cx, cy, imageUrl, imageOptions, qrSize)` – overlays a logo at the QR center.
- `drawModule(ctx, x, y, size, color, type)` – draws individual QR modules.
- `drawRoundedRect`, `drawCircleCorner`, `drawStandardCorner`, `isInCornerSquare` – helper utilities for custom shapes.

## lib/qr.js
Purpose: Server‑side utilities for generating QR code images and compositing logos.
### Variables
- `QRCodeLib`, `sharpLib` – lazily loaded libraries for QR generation and image processing.
### Functions
- `generateSvg(opts)` – returns an SVG string for given data, colors and gradients.
- `svgToPng(svg, size)` – converts an SVG string to a PNG buffer using Sharp.
- `embedLogoSvg(svg, logoUrl, relativeSize)` – injects a logo into the SVG.
- `composeLogoOnPng(pngBuffer, logoUrl, size, relativeSize)` – overlays a logo onto a PNG buffer.
