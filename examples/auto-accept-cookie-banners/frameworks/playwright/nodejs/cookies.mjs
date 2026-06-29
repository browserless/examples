// Connects to Browserless, navigates to a page, dismisses any cookie consent banner
// by trying common accept-button selectors, then captures a screenshot.
// Use this approach when the built-in blockConsentModals=true parameter doesn't handle
// a specific banner framework on the target site.
//
// Install: npm install playwright-core
// Run:     node cookies.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  // Use the default context — browser.newPage() creates a new context that
  // doesn't inherit proxy, profile, or launch settings.
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/clarity-health', { waitUntil: 'networkidle' });

  // Try common accept-button selectors — banners rarely share a single standard attribute.
  const cookieSelectors = [
    '[id*="accept"]',
    '[class*="accept"]',
    'button[id*="cookie"]',
    '#onetrust-accept-btn-handler',
    '.cc-accept',
  ];

  for (const selector of cookieSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible()) {
      await el.click();
      console.log(`Dismissed banner with selector: ${selector}`);
      await new Promise(r => setTimeout(r, 500));
      break;
    }
  }

  await page.screenshot({ path: 'page.png', fullPage: true });
  console.log('Screenshot saved to page.png');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
