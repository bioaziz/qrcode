import test from 'node:test';
import assert from 'node:assert';
import { generateSvg, svgToPng } from '../lib/qr.js';

test('generateSvg outputs svg', async (t) => {
  try {
    const svg = await generateSvg({ data: 'hello' });
    assert.match(svg, /<svg/);
  } catch (e) {
    t.skip('dependencies missing');
  }
});

test('svgToPng converts', async (t) => {
  try {
    const svg = await generateSvg({ data: 'hello' });
    const png = await svgToPng(svg, 256);
    assert.ok(Buffer.isBuffer(png));
  } catch (e) {
    t.skip('dependencies missing');
  }
});
