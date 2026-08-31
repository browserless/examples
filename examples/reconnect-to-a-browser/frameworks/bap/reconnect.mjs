// Hands a BAP session off with page.reconnect() and reattaches to the same session.
// Endpoints come back without credentials, so every follow-up connection has to
// add its own token or it gets a 401 Unauthorized. Never log a token-bearing URL.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node reconnect.mjs

import Browserless from '@browserless.io/bap-ts';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: TOKEN,
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/aether', { waitUntil: 'domContentLoaded' });

  // Keep the session alive for 60 seconds after this client disconnects.
  const { browserQLEndpoint, browserWSEndpoint } = await page.reconnect({ timeout: 60000 });
  console.log({ browserQLEndpoint, browserWSEndpoint });

  // Reattach to the same session — cookies, localStorage, and page state carry
  // over. browserWSEndpoint works the same way for a Puppeteer client over CDP.
  const resumed = Browserless.connect({
    browserWSEndpoint: browserQLEndpoint,
    token: TOKEN,
  });

  try {
    const resumedPage = await resumed.newPage();
    console.log('Still on:', await resumedPage.title());
  } finally {
    // Closing the resumed client ends the shared session for good.
    await resumed.close();
  }
} catch (error) {
  // Only close when the handoff never happened, so nothing is left stranded.
  await browser.close();
  throw error;
}
