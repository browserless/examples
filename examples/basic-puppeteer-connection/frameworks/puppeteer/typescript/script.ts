// Connects to Browserless by replacing puppeteer.launch() with puppeteer.connect().
// Use puppeteer-core — it skips bundling local browser binaries.
//
// Install: npm install puppeteer-core && npm install --save-dev typescript @types/node
// Run:     npx ts-node script.ts

import puppeteer, { Browser } from 'puppeteer-core';

const browser: Browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  console.log('Title:', await page.title());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
