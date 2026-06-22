// Clicks a link and waits for navigation to complete using Puppeteer.
//
// Install: npm install puppeteer-core
// Run:     node navigate-after-click.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });

  // Click the link and wait for navigation in parallel.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('a'),
  ]);

  console.log('Navigated to:', page.url());
  console.log('Page title:', await page.title());
} finally {
  await browser.close();
}
