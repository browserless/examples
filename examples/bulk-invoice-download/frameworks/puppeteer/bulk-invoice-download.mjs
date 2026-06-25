// Logs into a sandbox vendor portal and downloads invoices from each order using Puppeteer.
//
// Install: npm install puppeteer-core
// Run:     node bulk-invoice-download.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();

  const cdpSession = await page.createCDPSession();
  await cdpSession.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: '/tmp/invoices',
  });

  await page.goto('https://scraping-sandbox.netlify.app/harvest-direct/vendor-portal', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('form');
  await page.type('input[name="email"]', 'demo@example.com');
  await page.type('input[name="password"]', 'helloworld');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  const orderLinks = await page.$$eval('table tbody tr td a', (links) =>
    links.map((a) => a.href)
  );

  for (const link of orderLinks) {
    await page.goto(link, { waitUntil: 'networkidle2' });
    const downloadBtn = await page.$('a[download]');
    if (downloadBtn) {
      await downloadBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`Downloaded invoices from ${orderLinks.length} orders`);
} finally {
  await browser.close();
}
