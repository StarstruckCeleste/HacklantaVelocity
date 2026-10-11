import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFileSync, existsSync } from 'node:fs';

const file = new URL('../.env', import.meta.url);
const rl = createInterface({ input, output });
try {
  if (existsSync(file)) {
    const answer = (await rl.question('An .env file already exists. Replace it? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y') { console.log('Existing configuration kept.'); process.exit(0); }
  }
  const key = (await rl.question('Paste your private Roboflow API key: ')).trim();
  if (!key || /[\r\n]/.test(key) || key.includes('your_private')) {
    console.error('Please provide a valid key.'); process.exitCode = 1;
  } else {
    writeFileSync(file, `ROBOFLOW_API_KEY=${key}\n`, { mode: 0o600 });
    console.log('Saved to .env (ignored by Git). Now run: npm run dev');
  }
} finally { rl.close(); }
