// Takes a full-page screenshot with BAP and saves it to disk.
// `path` writes the file directly, so no fs call is needed in Node.js.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node screenshot.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/receipt', { waitUntil: 'networkIdle' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
