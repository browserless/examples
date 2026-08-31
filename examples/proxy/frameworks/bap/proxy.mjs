// Routes a BAP session through a residential proxy and prints the egress IP.
// Proxy routing is set on the connection URL, the same as the REST and BQL
// APIs. The SDK appends `&token=` when the endpoint already has a query.
// To proxy only some requests rather than the whole session, page.proxy()
// takes a matcher — `url`, `type`, or `method` — alongside the routing
// options. Without one, nothing matches and no traffic is proxied.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node proxy.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/chromium/bql?proxy=residential&proxyCountry=us',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://api.ipify.org?format=json', { waitUntil: 'domContentLoaded' });

  const { text } = await page.text({ selector: 'body' });
  console.log(text);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
