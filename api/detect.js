import { runRoboflowDetection, detectionErrorResponse } from '../lib/roboflow.js';

// Vercel automatically serves this as POST /api/detect.
export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Only POST requests are supported.' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await runRoboflowDetection(body, process.env.ROBOFLOW_API_KEY);
    return res.status(200).json(result);
  } catch (error) {
    const { status, body } = detectionErrorResponse(error);
    return res.status(status).json(body);
  }
}
