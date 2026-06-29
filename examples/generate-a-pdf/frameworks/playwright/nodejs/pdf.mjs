// Generates a PDF from a live browser session via Playwright.
// Use this approach when you need to interact with the page before capturing.
//
// Install: npm install playwright-core
// Run:     node pdf.mjs

import { chromium } from 'playwright-core';
import fs from 'fs/promises';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);
try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/dashboard-report', { waitUntil: 'networkidle' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
  });
  await fs.writeFile('output.pdf', pdf);
  console.log('PDF saved as output.pdf.');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
