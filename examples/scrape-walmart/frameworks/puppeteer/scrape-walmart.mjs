// Scrapes Walmart product listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-walmart.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.walmart.com/search?q=coffee+maker', {
    waitUntil: 'networkidle2',
  });

  await new Promise((r) => setTimeout(r, 2000));

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
