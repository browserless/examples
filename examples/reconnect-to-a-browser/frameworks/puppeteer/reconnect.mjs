// Disconnects from a remote Puppeteer browser session and reconnects to the same session.
// Uses the Browserless.reconnect CDP command to keep the browser alive after disconnecting.
//
// Install: npm install puppeteer-core
// Run:     node reconnect.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();

  await page.goto('https://example.com', { waitUntil: 'networkidle2' });

  // Keep the browser alive for 60 seconds after disconnecting.
  const { browserWSEndpoint } = await cdp.send('Browserless.reconnect', {
    timeout: 60000,
  });

  // Disconnect (does not kill the browser — it stays alive).
  await browser.close();

  console.log('Reconnect URL:', browserWSEndpoint);

  // Reconnect to the same browser session.
  const reconnected = await puppeteer.connect({
    browserWSEndpoint: `${browserWSEndpoint}?token=${TOKEN}`,
  });

  const pages = await reconnected.pages();
  const existingPage = pages[0];
  console.log('Still on:', await existingPage.title());

  await reconnected.close();
} catch (err) {
  await browser.close();
  throw err;
}
