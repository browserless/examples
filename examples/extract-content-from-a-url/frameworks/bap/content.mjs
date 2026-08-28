// Extracts the fully rendered HTML of a page with BAP.
// html() returns the serialized DOM after all scripts have executed.
// Pass a `selector` to html() to scope the output to part of the page.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node content.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/javascript-enabled', { waitUntil: 'domContentLoaded' });

  const { html } = await page.html();
  console.log(html?.slice(0, 500));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
