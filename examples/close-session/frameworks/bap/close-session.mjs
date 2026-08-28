// Extracts text from a page and closes the BAP session when done.
// browser.close() in the finally block ends the session, so there is no
// stop URL to call separately.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node close-session.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'networkIdle' });

  const { text } = await page.text({ selector: 'h1' });
  console.log(text);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
