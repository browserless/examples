// Fills out a form with BAP, solves the CAPTCHA guarding it, and submits.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node form.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.browserless.io/practice-form');

  await page.type('#Email', 'user@example.com');
  await page.type('#Message', 'Hello from Browserless!');
  await page.select('select#Subject', 'Support');

  // Clears the CAPTCHA guarding the form before submitting.
  const { solved } = await page.solve();
  console.log({ solved });

  await page.click("button[type='submit']");
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
