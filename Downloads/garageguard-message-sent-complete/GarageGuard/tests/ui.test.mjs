import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const scene = readFileSync(new URL('../src/GarageScene.jsx', import.meta.url), 'utf8');
const style = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const upload = readFileSync(new URL('../src/RoboflowUpload.jsx', import.meta.url), 'utf8');

test('removed unnecessary header and footer text', () => {
  for (const removed of ['WORKER-FIRST FACILITY AI', 'DEMO BUILD', 'GG-001 / DEMONSTRATION EXPERIENCE', 'SYSTEM ONLINE']) {
    assert.equal(app.includes(removed), false, `${removed} is still present`);
  }
});

test('3D spill click opens the existing incident report', () => {
  assert.match(app, /onSpillClick=\{openSpillReport\}/);
  assert.match(scene, /Raycaster\(\)/);
  assert.match(scene, /isSpillAtPointer\(event\)\) onSpillClick\?\.\(\)/);
  assert.match(style, /\.story \{[^}]*pointer-events: none;/);
  assert.match(style, /\.three-stage \{[^}]*pointer-events: auto;/);
});

test('AI uploader is user driven and only shows real detections', () => {
  assert.match(upload, /onClick=\{rerun\}/);
  assert.match(upload, /Detect litter/);
  assert.match(upload, /visible\.map/);
  assert.doesNotMatch(upload, /Try sample|MINIMUM CONFIDENCE|confidenceThreshold|loadSample|Show bounding boxes/);
});

test('One-app package includes a single npm dev command', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.dev, 'node server/start.mjs');
});


test('Detector uses the same-origin API, no public key or external URL', () => {
  const config = readFileSync(new URL('../src/detection-config.js', import.meta.url), 'utf8');
  assert.match(config, /return '\/api\/detect'/);
  assert.doesNotMatch(config, /ROBOFLOW_API_KEY|RENDER_DETECTION_ENDPOINT/);
});

test('No live camera feed panel or page in the dashboard', () => {
  const dash = readFileSync(new URL('../src/Dashboard.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(dash, /Live Camera Feed|page==='Live Cameras'|name: 'Live Cameras'/);
});
