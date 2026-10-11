// Used by the unified GarageGuard web server for both local and hosted detection.
// The API key never travels to the browser.
export const ROBOFLOW_WORKSPACE = 'irfan-5hnr6';
export const ROBOFLOW_WORKFLOW = 'my-first-project-vmy-first-project-5j964-1-rfdetr-small-t1-logic';
const ENDPOINT = `https://serverless.roboflow.com/${ROBOFLOW_WORKSPACE}/workflows/${ROBOFLOW_WORKFLOW}`;
const MAX_BASE64_LENGTH = 3_400_000; // Fits within common serverless request-body limits.

export class DetectionError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function isBox(value) {
  return value && typeof value === 'object' &&
    ['x', 'y', 'width', 'height'].every(key => Number.isFinite(Number(value[key]))) &&
    Number(value.width) > 0 && Number(value.height) > 0;
}

// Roboflow Workflows output field names vary by workflow configuration.
// Find the actual model's prediction array instead of assuming a block name.
export function extractDetections(workflowResponse) {
  const candidates = [];
  const seen = new Set();
  function visit(value, inheritedImage, depth) {
    if (!value || typeof value !== 'object' || depth > 8 || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      if (value.length && value.every(isBox)) {
        candidates.push({ predictions: value, image: inheritedImage });
        return;
      }
      for (const item of value) visit(item, inheritedImage, depth + 1);
      return;
    }
    const image = value.image && Number.isFinite(Number(value.image.width))
      ? value.image : inheritedImage;
    for (const field of ['predictions', 'detections']) {
      if (Array.isArray(value[field])) {
        if (value[field].length === 0 || value[field].every(isBox)) {
          candidates.push({ predictions: value[field], image });
        } else {
          visit(value[field], image, depth + 1);
        }
      } else if (value[field] && typeof value[field] === 'object') {
        visit(value[field], image, depth + 1);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      if (['image', 'predictions', 'detections', 'visualization', 'output_image', 'api_key'].includes(key)) continue;
      if (child && typeof child === 'object') visit(child, image, depth + 1);
    }
  }
  visit(workflowResponse, null, 0);
  if (!candidates.length) {
    throw new DetectionError(422,
      'The Roboflow workflow did not return bounding-box predictions. In Roboflow, add the model predictions to the workflow Outputs block, then retry.');
  }
  candidates.sort((a, b) => b.predictions.length - a.predictions.length);
  const selected = candidates[0];
  return {
    detections: selected.predictions.slice(0, 150).map((p, i) => {
      const confidence = Number(p.confidence ?? 0);
      return {
        id: String(p.detection_id ?? `box-${i + 1}`),
        label: String(p.class ?? p.class_name ?? p.label ?? 'Object'),
        confidence: Math.max(0, Math.min(1, confidence > 1 ? confidence / 100 : confidence)),
        x: Number(p.x), y: Number(p.y),
        width: Number(p.width), height: Number(p.height),
      };
    }),
    imageWidth: Number(selected.image?.width) || null,
    imageHeight: Number(selected.image?.height) || null,
  };
}

export async function runRoboflowDetection(body, apiKey, fetcher = fetch) {
  if (!apiKey) throw new DetectionError(503,
    'Roboflow is not configured. Run npm run setup locally, or set ROBOFLOW_API_KEY on your hosting service.');
  const base64 = body?.image;
  if (typeof base64 !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length < 100) {
    throw new DetectionError(400, 'Please upload a valid JPG, PNG, or WebP image.');
  }
  if (base64.length > MAX_BASE64_LENGTH) {
    throw new DetectionError(413, 'This image is too large to analyze. Try a smaller image.');
  }
  let response;
  try {
    response = await fetcher(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: { image: { type: 'base64', value: base64 } },
      }),
      signal: AbortSignal.timeout(45000),
    });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new DetectionError(504, 'Roboflow took too long to respond. Please retry.');
    }
    throw new DetectionError(502, 'Could not connect to Roboflow Cloud. Please retry.');
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new DetectionError(502, 'Roboflow rejected the API key. Check ROBOFLOW_API_KEY and workspace access.');
    }
    if (response.status === 404) {
      throw new DetectionError(502, 'The configured Roboflow workflow was not found. Check its workspace and workflow ID.');
    }
    if (response.status === 413) {
      throw new DetectionError(413, 'Roboflow rejected the image size. Try a smaller image.');
    }
    if (response.status === 429) {
      throw new DetectionError(429, 'Roboflow rate limit reached. Please wait before trying again.');
    }
    throw new DetectionError(502, `Roboflow returned an error (HTTP ${response.status}). Check that the workflow is deployed on Cloud.`);
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new DetectionError(502, 'Roboflow returned an unreadable response.');
  }
  return extractDetections(result);
}

export function detectionErrorResponse(error) {
  return {
    status: error instanceof DetectionError ? error.status : 500,
    body: { error: error instanceof DetectionError ? error.message : 'Unexpected detection error. Please retry.' },
  };
}
