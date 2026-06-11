// Fills and submits a form via a live Playwright browser session.
// Uses waitForLoadState after click to confirm the form was processed.
//
// Install: npm install playwright-core
// Run:     node form.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);
try {
  const page = await browser.newPage();
  await page.goto('https://www.browserless.io/practice-form', {
    waitUntil: 'networkidle',
  });

  await page.fill('#Email', 'user@example.com');
  await page.fill('#Message', 'Hello from Browserless!');
  await page.selectOption('select#Subject', 'Support');
  await page.click("button[type='submit']");
  await page.waitForLoadState('networkidle');

  console.log('Form submitted, current URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
