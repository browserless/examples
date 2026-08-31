// Runs a Google search with BAP and extracts the result headings.
// BAP has no keyboard API, so navigate straight to the results URL.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node search.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=Browserless+headless+browser');

  // `wait: true` holds until the selector appears, so no separate wait call.
  const results = await page.mapSelector('h3', { wait: true });
  console.log(results.map((result) => result.innerText));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
