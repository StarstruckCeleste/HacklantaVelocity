import { defineConfig, loadEnv } from 'vite';
import { runRoboflowDetection, detectionErrorResponse } from './lib/roboflow.js';

// The same /api/detect route works with `npm run dev` and on Vercel.
// No need to run a separate Python server or expose a browser API key.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [{
      name: 'garageguard-local-roboflow-api',
      configureServer(server) {
        server.middlewares.use('/api/detect', async (req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Allow', 'POST');
            res.end(JSON.stringify({ error: 'Only POST requests are supported.' }));
            return;
          }
          try {
            const chunks = [];
            let size = 0;
            for await (const chunk of req) {
              size += chunk.length;
              if (size > 3_600_000) {
                res.statusCode = 413;
                res.end(JSON.stringify({ error: 'The image is too large to upload.' }));
                return;
              }
              chunks.push(chunk);
            }
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            const result = await runRoboflowDetection(body, env.ROBOFLOW_API_KEY || process.env.ROBOFLOW_API_KEY);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (error) {
            const output = detectionErrorResponse(error);
            res.statusCode = output.status;
            res.end(JSON.stringify(output.body));
          }
        });
      },
    }],
  };
});
