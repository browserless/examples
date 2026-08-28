// Clicks a link with BAP and waits for the navigation before reading the new page.
// click() doesn't imply navigation, so wait for the load before reading the
// new page — otherwise you may read the old DOM.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node navigate-after-click.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'domContentLoaded' });

  await page.click('a[href="/contact-us"]');
  await page.waitForNavigation({ waitUntil: 'domContentLoaded' });

  const heading = await page.$eval('h1');
  console.log(heading);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
