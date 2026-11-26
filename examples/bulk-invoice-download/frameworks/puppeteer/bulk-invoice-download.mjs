// Logs into a sandbox vendor portal and downloads invoices from each order using Puppeteer.
//
// Install: npm install puppeteer-core
// Run:     node bulk-invoice-download.mjs

import fs from 'fs';
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();

  // Stream each finished download back to this script instead of leaving it
  // on the remote browser. Downloads are off by default, so opt in.
  await cdp.send('Browserless.setDownloadEnabled', { enabled: true });
  const nextDownload = () =>
    new Promise((resolve) => cdp.once('Browserless.fileDownloaded', resolve));

  await page.goto('https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('form');
  await page.type('input[name="email"]', 'demo@example.com');
  await page.type('input[name="password"]', 'helloworld');
  await page.click('button[type="submit"]');

  // The portal renders the orders table client-side after login.
  await page.waitForSelector('table tbody tr td a');
  const orderLinks = await page.$$eval('table tbody tr td a', (links) =>
    links.map((a) => a.href)
  );

  for (const link of orderLinks) {
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[download]');

    // Register before clicking, then wait for the file before leaving the page.
    const downloaded = nextDownload();
    await page.click('a[download]');
    const { filename, data, error, maxBytes } = await downloaded;
    // Files over the transfer limit arrive without data.
    if (error) {
      console.warn(`skipped: ${filename} (${error}, limit ${maxBytes} bytes)`);
      continue;
    }
    fs.writeFileSync(filename, Buffer.from(data, 'base64'));
    console.log(`saved: ${filename}`);
  }

  console.log(`Downloaded invoices from ${orderLinks.length} orders`);
} finally {
  await browser.close();
}
