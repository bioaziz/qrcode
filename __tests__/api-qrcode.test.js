import test from 'node:test';
import assert from 'node:assert';

async function loadHandler(t) {
  try {
    const mod = await import('../pages/api/v1/qrcode.js');
    return mod.default;
  } catch (e) {
    t.skip('dependencies missing');
    return null;
  }
}

function createRes() {
  const res = { statusCode: 200, headers: {}, body: null };
  res.status = function (c) { this.statusCode = c; return this; };
  res.setHeader = function (k, v) { this.headers[k] = v; };
  res.send = function (b) { this.body = b; };
  res.json = function (o) { this.headers['Content-Type'] = 'application/json'; this.body = JSON.stringify(o); };
  res.end = function (b) { this.body = b; };
  return res;
}

test('GET /api/v1/qrcode requires data', async (t) => {
  const handler = await loadHandler(t);
  if (!handler) return;
  const req = { method: 'GET', query: {} };
  const res = createRes();
  await handler(req, res);
  assert.strictEqual(res.statusCode, 400);
});

test('POST /api/v1/qrcode requires auth', async (t) => {
  const handler = await loadHandler(t);
  if (!handler) return;
  const req = { method: 'POST', headers: {}, body: {} };
  const res = createRes();
  await handler(req, res);
  assert.strictEqual(res.statusCode, 401);
});
