// Clicks a link and waits for navigation to complete using Playwright.
// Playwright automatically waits for navigation after click — no special handling needed.
//
// Install: npm install playwright-core
// Run:     node navigate-after-click.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'domcontentloaded' });

  // Approach 1 — works when you don't know the destination URL:
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('a[href="/contact-us"]'),
  ]);

  // Approach 2 — simpler when you know the destination URL pattern:
  // await page.click('a[href="/contact-us"]');
  // await page.waitForURL('**/contact-us');

  const heading = await page.$eval('h1', el => el.textContent.trim());
  console.log('URL:', page.url());
  console.log('Heading:', heading);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
