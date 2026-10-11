import { createServer } from 'node:http';
import { runRoboflowDetection, detectionErrorResponse, DetectionError } from './lib/roboflow.js';

const MAX_JSON_BYTES = 3_600_000;
const MINUTE_MS = 60_000;
const REQ_LIMIT = Number(process.env.REQUEST_LIMIT_PER_MINUTE) || 12;

// CORS is a browser access policy, not authentication. The rate limit is
// intentionally conservative for a public hackathon demo and is per instance.
export function createDetectionServer({
  apiKey = process.env.ROBOFLOW_API_KEY,
  allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
  fallbackHandler = null,
  detector = runRoboflowDetection,
  limit = REQ_LIMIT,
} = {}) {
  const clients = new Map();
  let active = 0;
  return createServer(async (req, res) => {
    // Serve Vite pages/assets or built static files through the same server.
    if (req.url !== '/health' && req.url !== '/api/detect' && fallbackHandler) {
      return fallbackHandler(req, res);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Origin');
    const origin = req.headers.origin;
    // Requests to the same site are allowed without CORS configuration.
    const sameOrigin = Boolean(origin && (() => {
      try { return new URL(origin).host === req.headers.host; } catch { return false; }
    })());
    const originAllowed = !origin || sameOrigin || allowedOrigins.includes(origin);
    if (origin && originAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '600');
    }
    const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
    if (req.url === '/health' && req.method === 'GET') {
      reply(200, { ok: true, configured: Boolean(apiKey) });
      return;
    }
    if (req.url !== '/api/detect') {
      reply(404, { error: 'Not found. Use POST /api/detect.' });
      return;
    }
    if (!originAllowed) {
      reply(403, { error: 'This website origin is not allowed. Add its domain to ALLOWED_ORIGINS on Render.' });
      return;
    }
    if (req.method === 'OPTIONS') {
      if (!origin) return reply(400, { error: 'Missing Origin header.' });
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      reply(405, { error: 'Only POST is supported.' });
      return;
    }
    if (!apiKey) {
      reply(503, { error: 'AI is not configured on this server. For local use, run npm run setup and restart npm run dev. For a deployed website, set ROBOFLOW_API_KEY in your hosting environment and redeploy.' });
      return;
    }
    const userIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    if (clients.size > 10000) {
      for (const [ip, entry] of clients) if (now >= entry.until) clients.delete(ip);
    }
    const old = clients.get(userIp);
    const entry = !old || now >= old.until ? { count: 0, until: now + MINUTE_MS } : old;
    if (entry.count >= limit) {
      res.setHeader('Retry-After', String(Math.ceil((entry.until - now) / 1000)));
      reply(429, { error: 'Too many scans. Wait a minute and try again.' });
      return;
    }
    entry.count += 1;
    clients.set(userIp, entry);
    if (active >= 3) {
      reply(503, { error: 'The AI demo is busy. Please try again shortly.' });
      return;
    }
    active += 1;
    try {
      const declaredSize = Number(req.headers['content-length'] || 0);
      if (declaredSize > MAX_JSON_BYTES) throw new DetectionError(413, 'Image too large. Please upload a smaller image.');
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_JSON_BYTES) throw new DetectionError(413, 'Image too large. Please upload a smaller image.');
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { throw new DetectionError(400, 'Invalid JSON request.'); }
      const result = await detector(body, apiKey);
      reply(200, result);
    } catch (err) {
      const { status, body } = detectionErrorResponse(err);
      reply(status, body);
    } finally { active -= 1; }
  });
}

