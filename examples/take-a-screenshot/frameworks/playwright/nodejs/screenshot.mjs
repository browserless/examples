// Captures a webpage as a PNG via a live Playwright browser session.
// Use this approach when you need to interact with the page before capturing.
//
// Install: npm install playwright-core
// Run:     node screenshot.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('Screenshot saved as screenshot.png.');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
