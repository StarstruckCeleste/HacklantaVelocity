import assert from 'node:assert/strict';
import test from 'node:test';
import { createDetectionServer } from '../api.js';
import { runRoboflowDetection, extractDetections } from '../lib/roboflow.js';

const ALLOWED = 'https://garageguard-demo.vercel.app';
async function launch(options = {}) {
  const server = createDetectionServer({
    apiKey: 'TEST-KEY-NOT-REAL',
    allowedOrigins: [ALLOWED],
    detector: async (body, key) => ({ detections: [{ label: 'Bottle', x: 3, y: 4, width: 2, height: 2, confidence: .9 }], imageWidth: 10, imageHeight: 10 }),
    ...options,
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  return { server, url, close: () => new Promise(resolve => server.close(resolve)) };
}

const body = JSON.stringify({ image: 'A'.repeat(120) });

test('GET /health hides key and reports config', async () => {
  const s = await launch();
  try {
    const res = await fetch(s.url + '/health');
    const payload = await res.json();
    assert.equal(res.status, 200);
    assert.equal(payload.configured, true);
    assert.equal(JSON.stringify(payload).includes('TEST-KEY-NOT-REAL'), false);
  } finally { await s.close(); }
});

test('browser CORS preflight allows precisely configured website', async () => {
  const s = await launch();
  try {
    const res = await fetch(s.url + '/api/detect', { method: 'OPTIONS', headers: { Origin: ALLOWED, 'Access-Control-Request-Method': 'POST' } });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('access-control-allow-origin'), ALLOWED);
    assert.equal(res.headers.get('access-control-allow-headers'), 'Content-Type');
  } finally { await s.close(); }
});

test('rejects unknown origins', async () => {
  const s = await launch();
  try {
    const res = await fetch(s.url + '/api/detect', { method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' }, body });
    assert.equal(res.status, 403);
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  } finally { await s.close(); }
});

test('valid public upload returns model bounding boxes', async () => {
  const s = await launch();
  try {
    const res = await fetch(s.url + '/api/detect', { method: 'POST', headers: { Origin: ALLOWED, 'Content-Type': 'application/json' }, body });
    const payload = await res.json();
    assert.equal(res.status, 200);
    assert.equal(payload.detections[0].label, 'Bottle');
  } finally { await s.close(); }
});

test('bad JSON and oversized images return errors', async () => {
  const s = await launch();
  try {
    const res = await fetch(s.url + '/api/detect', { method: 'POST', headers: { Origin: ALLOWED, 'Content-Type': 'application/json' }, body: 'oops' });
    assert.equal(res.status, 400);
    const big = await fetch(s.url + '/api/detect', { method: 'POST', headers: { Origin: ALLOWED, 'Content-Type': 'application/json' }, body: 'x'.repeat(3_600_100) });
    assert.equal(big.status, 413);
  } finally { await s.close(); }
});

test('rate limits rapid public requests', async () => {
  const s = await launch({ limit: 1 });
  try {
    const init = { method: 'POST', headers: { Origin: ALLOWED, 'Content-Type': 'application/json' }, body };
    assert.equal((await fetch(s.url + '/api/detect', init)).status, 200);
    assert.equal((await fetch(s.url + '/api/detect', init)).status, 429);
  } finally { await s.close(); }
});

test('normalizes real Roboflow model response data', () => {
  const parsed = extractDetections([{ model_predictions: { image: { width: 320, height: 240 }, predictions: [{ x: 30, y: 40, width: 20, height: 10, confidence: .98, class: 'litter' }] } }]);
  assert.equal(parsed.detections[0].label, 'litter');
  assert.equal(parsed.imageHeight, 240);
});
