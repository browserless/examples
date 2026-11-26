// Connects to Browserless, navigates to a page, dismisses any cookie consent banner
// by trying common accept-button selectors, then captures a screenshot.
// Use this approach when the built-in blockConsentModals=true parameter doesn't handle
// a specific banner framework on the target site.
//
// Install: npm install playwright-core
// Run:     node cookies.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE'
);

try {
  // Use the default context — browser.newPage() creates a new context that
  // doesn't inherit proxy, profile, or launch settings.
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.onetrust.com/', { waitUntil: 'load' });

  const cookieSelectors = [
    '[id*="accept"]',
    '[class*="accept"]',
    'button[id*="cookie"]',
    '#onetrust-accept-btn-handler',
    '.cc-accept',
  ];

  // Consent banners usually load after the page itself. Wait up to 10 seconds
  // for one to appear, and carry on if none does.
  await page
    .locator(cookieSelectors.map((selector) => `${selector}:visible`).join(', '))
    .first()
    .waitFor({ timeout: 10_000 })
    .catch(() => {});

  for (const selector of cookieSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible()) {
      await el.click();
      console.log(`Dismissed banner with selector: ${selector}`);
      // Give the banner a moment to animate out before the screenshot.
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  await page.screenshot({ path: 'page.png', fullPage: true });
  console.log('Screenshot saved to page.png');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
