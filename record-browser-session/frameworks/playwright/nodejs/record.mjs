// Records a browser session as a .webm file using Browserless CDP commands.
// Must reuse the existing context and page from connectOverCDP — creating new ones
// starts a fresh session that isn't wired to the recording.
//
// Install: npm install playwright-core
// Run:     node record.mjs

import fs from 'fs';
import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}&headless=false&stealth&record=true`
);

const context = browser.contexts()[0];
const page = context.pages()[0];

// Set viewport before starting — dimensions are fixed for the entire recording.
await page.setViewportSize({ width: 1280, height: 720 });

const cdp = await page.context().newCDPSession(page);
await cdp.send('Browserless.startRecording');

await page.goto('https://example.com', { waitUntil: 'networkidle' });
await new Promise(r => setTimeout(r, 2000));

await page.goto('https://example.com/about', { waitUntil: 'networkidle' });
await new Promise(r => setTimeout(r, 2000));

// base64 encoding is required — CDP can't transfer raw binary over its text protocol.
const { value } = await cdp.send('Browserless.stopRecording', { encoding: 'base64' });
fs.writeFileSync('recording.webm', Buffer.from(value, 'base64'));
console.log('Recording saved to recording.webm');

await browser.close();
