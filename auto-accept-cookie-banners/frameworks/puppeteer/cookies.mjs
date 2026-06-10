// Connects to Browserless, navigates to a page, dismisses any cookie consent banner
// by trying common accept-button selectors, then captures a screenshot.
// Use this approach when the built-in blockConsentModals=true parameter doesn't handle
// a specific banner framework on the target site.
//
// Install: npm install puppeteer-core
// Run:     node cookies.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });

  // Try common accept-button selectors — banners rarely share a single standard attribute.
  const cookieSelectors = [
    '[id*="accept"]',
    '[class*="accept"]',
    'button[id*="cookie"]',
    '#onetrust-accept-btn-handler',
    '.cc-accept',
  ];

  for (const selector of cookieSelectors) {
    try {
      await page.click(selector);
      console.log(`Dismissed banner with selector: ${selector}`);
      await new Promise(r => setTimeout(r, 500));
      break;
    } catch {
      // selector not found on this page — try the next one.
    }
  }

  await page.screenshot({ path: 'page.png', fullPage: true });
  console.log('Screenshot saved to page.png');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
