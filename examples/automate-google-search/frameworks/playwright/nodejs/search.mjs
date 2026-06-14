// Navigates to Google, submits a search, and extracts result titles and links
// via a live Playwright browser session.
//
// Install: npm install playwright-core
// Run:     node search.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);
try {
  const page = await browser.newPage();
  await page.goto('https://www.google.com', { waitUntil: 'networkidle' });
  await page.fill('textarea[name="q"]', 'Browserless headless browser');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#search');
  const results = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h3')).map((h) => ({
      title: h.innerText,
      url: h.closest('a')?.href ?? null,
    }))
  );
  console.log(results);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
