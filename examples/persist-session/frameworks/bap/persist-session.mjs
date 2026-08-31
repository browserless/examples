// Seeds browser state (localStorage) in a BAP session.
// The seeded state lives only as long as this session. To reuse it, hand the
// session off with page.reconnect() instead of closing, or save it to an
// authenticated profile for reuse across separate sessions.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node persist-session.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com', { waitUntil: 'networkIdle' });

  // evaluate() resolves to `string | null` — null when the expression
  // returns nothing, so check before using the value.
  const result = await page.evaluate(`
    localStorage.setItem('shoppingCart', JSON.stringify({items: [{id: 1}], totalItems: 1}));
    localStorage.setItem('userPreferences', JSON.stringify({theme: 'dark'}));
    'state set'
  `);

  console.log(result ?? 'no value returned');

  // Call page.reconnect() here and skip the close below if you want another
  // client to reuse this state. Closing discards the seeded localStorage.
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
