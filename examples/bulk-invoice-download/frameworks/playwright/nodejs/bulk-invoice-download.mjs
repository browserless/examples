// Logs into a sandbox vendor portal and downloads invoices from each order using Playwright.
//
// Install: npm install playwright-core
// Run:     node bulk-invoice-download.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();

  await page.goto('https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('form');
  await page.fill('input[name="email"]', 'demo@example.com');
  await page.fill('input[name="password"]', 'helloworld');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  const orderLinks = await page.$$eval('table tbody tr td a', (links) =>
    links.map((a) => a.href)
  );

  for (const link of orderLinks) {
    await page.goto(link, { waitUntil: 'networkidle' });
    const downloadBtn = await page.$('a[download]');
    if (downloadBtn) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadBtn.click(),
      ]);
      const path = await download.path();
      console.log(`Downloaded: ${download.suggestedFilename()} -> ${path}`);
    }
  }

  console.log(`Downloaded invoices from ${orderLinks.length} orders`);
} finally {
  await browser.close();
}
