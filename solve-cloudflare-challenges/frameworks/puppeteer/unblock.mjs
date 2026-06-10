// Bypasses Cloudflare challenges via /unblock, then connects Puppeteer to the
// already-unblocked session using the returned browserWSEndpoint.
// The ttl parameter keeps the browser alive long enough for the client to connect.
//
// Install: npm install puppeteer-core
// Run:     node unblock.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const { browserWSEndpoint } = await fetch(
  `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example-cloudflare-protected.com',
      browserWSEndpoint: true,
      ttl: 30000,
    }),
  }
).then((r) => r.json());

// The /unblock response returns a raw WebSocket URL — append the token before connecting.
const browser = await puppeteer.connect({
  browserWSEndpoint: `${browserWSEndpoint}?token=${TOKEN}`,
});

try {
  const [page] = await browser.pages();
  console.log('Title:', await page.title());
  console.log('URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
