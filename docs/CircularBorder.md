# Circular Border Options

The custom renderer supports decorative circular borders around the QR code. Three parameters control its geometry:

- `size`: overall canvas width and height in pixels. This sets the maximum diameter available for the QR code and its border.
- `ringWidth`: thickness of the outer ring stroke. The renderer uses this value as the stroke width.
- `radiusOffset`: distance between the QR modules and the inner edge of the ring, as well as the margin between the ring and the canvas edge.

These values are used to compute the ring dimensions:

```js
outerRadius = size / 2 - radiusOffset - ringWidth / 2;
innerRadius = qrSize / 2 + radiusOffset;
strokeWidth = ringWidth;
```

Increasing `size` enlarges the overall diameter. A larger `ringWidth` produces a thicker border, while adjusting `radiusOffset` moves the ring closer to or farther from the QR code.

## Usage

```js
await renderCustomQR(canvas, {
  width: 256,
  height: 256,
  borderOptions: {
    circularBorder: true,
    ringWidth: 12,
    radiusOffset: 16
  }
});
```

In `QRDesigner` these values can be changed under the **Border** tab using the *Ring Thickness* and *Radius Offset* sliders.
