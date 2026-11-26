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
  await page.goto('https://httpbin.org/forms/post', { waitUntil: 'domcontentloaded' });

  await page.fill('input[name="custname"]', 'Jane Doe');
  await page.fill('input[name="custemail"]', 'jane@example.com');
  await page.check('input[value="medium"]');
  await page.check('input[value="cheese"]');
  await page.fill('textarea[name="comments"]', 'Hello from Browserless!');

  await page.click('form button');
  await page.waitForURL('**/post');

  // httpbin echoes the submission as JSON; `form` holds the posted fields.
  const body = await page.locator('body').innerText();
  console.log(JSON.parse(body).form);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
