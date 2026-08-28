// Solves a Cloudflare challenge with BAP via the managed stealth browser.
// Note the /stealth/bql endpoint — the stealth browser is what clears the challenge.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node unblock.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/stealth/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://example-cloudflare-protected.com', { waitUntil: 'networkIdle' });

  const { found, solved } = await page.solve({ type: 'cloudflare' });
  console.log({ found, solved, title: await page.title() });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
