// One application: the website and private Roboflow API share the same origin.
// No public Render URL or browser-side API key is needed.
export function getDetectionEndpoint() {
  return '/api/detect';
}
