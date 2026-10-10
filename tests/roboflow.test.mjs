import assert from 'node:assert/strict';
import test from 'node:test';
import { extractDetections, runRoboflowDetection, DetectionError } from '../lib/roboflow.js';

const box = { x: 240, y: 150, width: 80, height: 40, confidence: .94, class: 'Plastic Bottle' };

test('normalizes Roboflow Workflows object detection output', () => {
  const response = [{ model_predictions: { image: { width: 640, height: 480 }, predictions: [box] } }];
  const result = extractDetections(response);
  assert.equal(result.detections.length, 1);
  assert.equal(result.detections[0].label, 'Plastic Bottle');
  assert.equal(result.detections[0].confidence, .94);
  assert.equal(result.imageWidth, 640);
  assert.equal(result.imageHeight, 480);
});

test('empty prediction output is a valid no-detections result', () => {
  assert.deepEqual(extractDetections([{ model_predictions: { predictions: [] } }]).detections, []);
});

test('does not treat visualization-only workflow output as zero detections', () => {
  assert.throws(() => extractDetections([{ bounding_box_visualized: { type: 'base64', value: 'abc' } }]), /Outputs block/);
});

test('cloud request uses server-side key and base64 input and parses predictions', async () => {
  let request;
  const fakeFetch = async (url, options) => {
    request = { url, ...options };
    return { ok: true, json: async () => [{ predictions: { predictions: [box], image: { width: 640, height: 480 } } }] };
  };
  const result = await runRoboflowDetection({ image: 'A'.repeat(120) }, 'secret-for-test', fakeFetch);
  assert.equal(result.detections.length, 1);
  assert.match(request.url, /serverless\.roboflow\.com\/irfan-5hnr6\/workflows\//);
  assert.deepEqual(JSON.parse(request.body).inputs.image, { type: 'base64', value: 'A'.repeat(120) });
  assert.equal(JSON.parse(request.body).api_key, 'secret-for-test');
});

test('missing key returns actionable configuration error', async () => {
  await assert.rejects(() => runRoboflowDetection({ image: 'A'.repeat(120) }, ''),
    err => err instanceof DetectionError && err.status === 503);
});

test('upstream API error does not echo a secret or raw body', async () => {
  await assert.rejects(() => runRoboflowDetection({ image: 'A'.repeat(120) }, 'secret-for-test',
    async () => ({ ok: false, status: 403 })),
  err => err.status === 502 && !err.message.includes('secret-for-test'));
});

test('Vercel endpoint returns a useful error when the key is not configured', async () => {
  const { default: handler } = await import('../api/detect.js');
  const previous = process.env.ROBOFLOW_API_KEY;
  delete process.env.ROBOFLOW_API_KEY;
  const output = { statusCode: 0, headers: {}, body: null };
  const res = {
    setHeader(k, v) { output.headers[k] = v; return this; },
    status(n) { output.statusCode = n; return this; },
    json(value) { output.body = value; return this; },
  };
  try {
    await handler({ method: 'POST', body: { image: 'A'.repeat(120) } }, res);
    assert.equal(output.statusCode, 503);
    assert.match(output.body.error, /ROBOFLOW_API_KEY/);
  } finally {
    if (previous !== undefined) process.env.ROBOFLOW_API_KEY = previous;
  }
});
