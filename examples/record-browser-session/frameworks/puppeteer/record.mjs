// Records a browser session as a .webm file using Browserless CDP commands.
// Requires headless=false, stealth, and record=true in the WebSocket URL.
// Set the viewport before startRecording — dimensions are fixed for the entire recording.
//
// Install: npm install puppeteer-core
// Run:     node record.mjs

import fs from 'fs';
import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}&headless=false&stealth&record=true`,
});
try {
  const page = await browser.newPage();

  // Set viewport before starting — dimensions are fixed for the entire recording.
  await page.setViewport({ width: 1280, height: 720 });

  const cdp = await page.createCDPSession();
  await cdp.send('Browserless.startRecording');

  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.goto('https://example.com/about', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // base64 encoding is required — CDP can't transfer raw binary over its text protocol.
  const { value } = await cdp.send('Browserless.stopRecording', { encoding: 'base64' });
  fs.writeFileSync('recording.webm', Buffer.from(value, 'base64'));
  console.log('Recording saved to recording.webm');
} finally {
  await browser.close();
}
