// Logs into a sandbox vendor portal and downloads invoices from each order using Playwright.
//
// Install: npm install playwright-core
// Run:     node bulk-invoice-download.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
);

try {
  const page = await browser.newPage();

  await page.goto('https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('form');
  await page.fill('input[name="email"]', 'demo@example.com');
  await page.fill('input[name="password"]', 'helloworld');
  await page.click('button[type="submit"]');

  // The portal renders the orders table client-side after login.
  await page.waitForSelector('table tbody tr td a');
  const orderLinks = await page.$$eval('table tbody tr td a', (links) =>
    links.map((a) => a.href)
  );

  for (const link of orderLinks) {
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    // Register before clicking so the download can't be missed.
    const downloadPromise = page.waitForEvent('download');
    await page.click('a[download]');
    const download = await downloadPromise;
    // Saves on the machine running this script, not the remote browser.
    await download.saveAs(download.suggestedFilename());
    console.log(`saved: ${download.suggestedFilename()}`);
  }

  console.log(`Downloaded invoices from ${orderLinks.length} orders`);
} finally {
  await browser.close();
}
