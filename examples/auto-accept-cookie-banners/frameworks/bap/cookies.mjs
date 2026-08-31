// Dismisses a cookie consent banner with BAP, then takes a screenshot.
// Adjust the selector list to match the banner framework on the target site
// (OneTrust, CookieBot, and so on).
//
// Install: npm install @browserless.io/bap-ts
// Run:     node cookies.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/clarity-health', { waitUntil: 'networkIdle' });

  const selector = '[id*=accept], [class*=accept], button[id*=cookie]';

  // BAP has no `if` mutation, so branch in JavaScript instead.
  if (await page.$(selector)) {
    await page.click(selector);
  }

  await page.screenshot({ path: 'screenshot.png' });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
