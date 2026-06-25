// Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-amazon.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.amazon.com/s?k=wireless+headphones', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('div.s-result-item[data-asin]');

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div.s-result-item[data-asin]')).map((item) => ({
      asin: item.getAttribute('data-asin') ?? '',
      title: item.querySelector('h2 span')?.innerText?.trim() ?? '',
      price: item.querySelector('.a-price .a-offscreen')?.innerText?.trim() ?? '',
      rating: item.querySelector('.a-icon-alt')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(products, null, 2));
} finally {
  await browser.close();
}
