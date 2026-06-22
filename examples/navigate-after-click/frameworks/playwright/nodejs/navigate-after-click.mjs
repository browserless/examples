// Clicks a link and waits for navigation to complete using Playwright.
// Playwright automatically waits for navigation after click — no special handling needed.
//
// Install: npm install playwright-core
// Run:     node navigate-after-click.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://example.com', { waitUntil: 'networkidle' });

  // Playwright waits for navigation automatically after click.
  await page.click('a');
  await page.waitForLoadState('networkidle');

  console.log('Navigated to:', page.url());
  console.log('Page title:', await page.title());
} finally {
  await browser.close();
}
