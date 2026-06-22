// Scrapes Etsy product listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-etsy.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.etsy.com/search?q=candles', {
    waitUntil: 'networkidle',
  });

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.v2-listing-card')).map((card) => ({
      title: card.querySelector('h3')?.innerText?.trim() ?? '',
      price: card.querySelector('.currency-value')?.innerText?.trim() ?? '',
      link: card.querySelector('a.listing-link')?.href ?? '',
    }))
  );

  console.log(products);
} finally {
  await browser.close();
}
