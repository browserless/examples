// Opens multiple independent Playwright browser sessions on Browserless in parallel.
// Each chromium.connectOverCDP() call creates a separate managed browser.
//
// Install: npm install playwright-core
// Run:     node concurrent.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const WS = `wss://production-sfo.browserless.io?token=${TOKEN}`;
const URLS = [
  'https://example.com/page/1',
  'https://example.com/page/2',
  'https://example.com/page/3',
  'https://example.com/page/4',
  'https://example.com/page/5',
];

const results = await Promise.all(
  URLS.map(async (url, i) => {
    const browser = await chromium.connectOverCDP(WS);
    try {
      // Use the default context — browser.newPage() creates a new context that
      // doesn't inherit proxy, profile, or launch settings.
      const context = browser.contexts()[0];
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      const title = await page.title();
      console.log(`[${i + 1}] ${title}`);
      return { url, title };
    } finally {
      // Always close to release the session even on error.
      await browser.close();
    }
  })
);

console.log('Results:', results);
