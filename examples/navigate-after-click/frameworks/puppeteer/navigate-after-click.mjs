// Clicks a link and waits for navigation to complete using Puppeteer.
//
// Install: npm install puppeteer-core
// Run:     node navigate-after-click.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'domcontentloaded' });

  // Wrong — navigation may finish between these two lines:
  // await page.click('a[href="/contact-us"]');
  // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  // Right — Promise.all starts the wait before the click fires:
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('a[href="/contact-us"]'),
  ]);

  const heading = await page.$eval('h1', el => el.textContent.trim());
  console.log('URL:', page.url());
  console.log('Heading:', heading);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
