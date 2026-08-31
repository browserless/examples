// Batches multiple DOM queries into a single evaluate() call over one BAP session.
// One evaluate() keeps this to a single round trip. mapSelector can't be used
// here: it returns innerText/innerHTML/id/class only, with no way to read an href.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node batch-dom-queries.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'domContentLoaded' });

  const batched = await page.evaluate(`JSON.stringify({
    heading: document.querySelector('h1')?.innerText ?? null,
    links: [...document.querySelectorAll('a[href]')].map((a) => ({
      innerText: a.innerText,
      href: a.href,
    })),
  })`);

  console.log(JSON.parse(batched ?? '{}'));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
