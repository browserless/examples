// Disconnects from a remote Playwright browser session and reconnects to the same session.
// Uses the Browserless.reconnect CDP command to keep the browser alive after disconnecting.
//
// Install: npm install playwright-core
// Run:     node reconnect.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connect(
  `wss://production-sfo.browserless.io/chromium/playwright?token=${TOKEN}`
);

try {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);

  await page.goto('https://scraping-sandbox.netlify.app/aether', { waitUntil: 'networkidle' });

  // Keep the browser alive for 60 seconds after disconnecting.
  const { browserWSEndpoint } = await cdp.send('Browserless.reconnect', {
    timeout: 60000,
  });

  // Disconnect (does not kill the browser — it stays alive).
  await browser.close();

  console.log('Reconnect URL:', browserWSEndpoint);

  // Reconnect to the same browser session.
  const reconnected = await chromium.connect(
    `${browserWSEndpoint}?token=${TOKEN}`
  );

  const pages = reconnected.contexts()[0]?.pages() ?? [];
  if (pages.length > 0) {
    console.log('Still on:', await pages[0].title());
  }

  await reconnected.close();
} catch (err) {
  await browser.close();
  throw err;
}
