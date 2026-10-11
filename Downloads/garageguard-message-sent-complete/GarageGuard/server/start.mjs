import { readFileSync, existsSync, statSync, createReadStream, writeFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDetectionServer } from './api.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const envFile = resolve(root, '.env');
if (existsSync(envFile)) {
  // Load local-only secrets without sending them to the browser or committing them.
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z_0-9]*)\s*=\s*(.*?)\s*$/);
    if (match && !Object.hasOwn(process.env, match[1])) {
      const raw = match[2];
      process.env[match[1]] = raw.replace(/^(["'])(.*)\1$/, '$2');
    }
  }
}
const production = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

// First local launch: ask once, save only to the local, Git-ignored .env file.
// Never embed the private key in React, a public ZIP, or a deployed webpage.
if (!production && !process.env.ROBOFLOW_API_KEY && process.stdin.isTTY) {
  const { createInterface } = await import('node:readline/promises');
  const { stdin, stdout } = await import('node:process');
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    console.log('\nFirst-time AI setup (private; visitors will never see this).');
    const key = (await rl.question('Paste your existing Roboflow API key, then press Enter: ')).trim();
    if (key && !/[\\r\\n]/.test(key)) {
      const existing = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
      const otherLines = existing.split(/\\r?\\n/).filter(line => !/^\\s*ROBOFLOW_API_KEY\\s*=/.test(line));
      writeFileSync(envFile, [...otherLines.filter(Boolean), `ROBOFLOW_API_KEY=${key}`, ''].join('\\n'), { mode: 0o600 });
      process.env.ROBOFLOW_API_KEY = key;
      console.log('Key saved privately on this computer. Starting GarageGuard...\n');
    } else {
      console.log('No key entered. The site will open, but AI Detection needs a key.\n');
    }
  } finally {
    rl.close();
  }
}
const port = Number(process.env.PORT || (production ? 10000 : 5173));

function serveBuiltSite(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.statusCode = 405; res.end('Method not allowed'); return;
  }
  const dist = resolve(root, 'dist');
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.statusCode = 400; res.end('Bad request'); return; }
  let filename = resolve(dist, '.' + pathname);
  if (filename !== dist && !filename.startsWith(dist + sep)) {
    res.statusCode = 403; res.end('Forbidden'); return;
  }
  try {
    if (!statSync(filename).isFile()) filename = resolve(dist, 'index.html');
  } catch { filename = resolve(dist, 'index.html'); }
  if (!existsSync(filename)) {
    res.statusCode = 503; res.end('Website not built. Run npm run build first.'); return;
  }
  const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.woff2':'font/woff2' };
  res.setHeader('Content-Type', types[extname(filename)] || 'application/octet-stream');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'HEAD') { res.end(); return; }
  createReadStream(filename).pipe(res);
}

let vite;
const server = createDetectionServer({
  fallbackHandler: (req, res) => {
    if (production) return serveBuiltSite(req, res);
    return vite.middlewares(req, res);
  },
});
if (!production) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({
    root,
    server: { middlewareMode: true, hmr: { server } },
    appType: 'spa',
  });
}
server.listen(port, '0.0.0.0', () => {
  console.log(`\nGarageGuard running at http://localhost:${port}/`);
  console.log(`AI upload: http://localhost:${port}/#/demo`);
  if (!process.env.ROBOFLOW_API_KEY) console.log('AI Detection requires a private ROBOFLOW_API_KEY on the server.');
});
const shutdown = async () => {
  await vite?.close();
  server.close();
};
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
