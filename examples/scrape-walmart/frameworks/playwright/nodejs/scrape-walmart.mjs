// Scrapes Walmart product listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-walmart.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.walmart.com/search?q=coffee+maker', {
    waitUntil: 'networkidle',
  });

  await page.waitForTimeout(2000);

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-item-id]')).map((card) => ({
      title: card.querySelector('[data-automation-id="product-title"]')?.innerText?.trim() ?? '',
      price: card.querySelector('[itemprop="price"]')?.innerText?.trim() ?? '',
      rating: card.querySelector('[data-testid="product-ratings"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(products, null, 2));
} finally {
  await browser.close();
}
