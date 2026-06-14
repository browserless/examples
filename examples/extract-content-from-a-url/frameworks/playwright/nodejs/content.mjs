// Fetches the fully rendered HTML of a page via a live Playwright browser session.
// Use this approach when you need to interact with the page before extracting content.
//
// Install: npm install playwright-core
// Run:     node content.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });
  const html = await page.content();
  console.log(html.slice(0, 500));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
