// Connects to Browserless by replacing chromium.launch() with connectOverCDP().
// Use playwright-core — it skips bundling local browser binaries.
//
// Install: npm install playwright-core && npm install --save-dev typescript @types/node
// Run:     npx ts-node script.ts

import { chromium, Browser } from 'playwright-core';

const browser: Browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE'
);

try {
  // Use the default context — browser.newPage() creates a new context that
  // doesn't inherit proxy, profile, or launch settings.
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });
  console.log('Title:', await page.title());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
