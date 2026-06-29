// Extracts structured data from a fully rendered page via a live Playwright browser session.
// Use this approach when you need custom extraction logic or page interaction before scraping.
//
// Install: npm install playwright-core
// Run:     node scrape.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);
try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => ({
    heading: document.querySelector('h1')?.textContent,
    paragraphs: [...document.querySelectorAll('p')].map((el) => el.textContent),
  }));
  console.log(data);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
