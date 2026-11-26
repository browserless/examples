// Scrapes Amazon product listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-amazon.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.amazon.com/s?k=wireless+headphones', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('[data-component-type="s-search-result"]');

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-component-type="s-search-result"]'))
      .filter((el) => el.getAttribute('data-asin'))
      .map((el) => ({
        asin: el.getAttribute('data-asin'),
        title: el.querySelector('h2 span')?.innerText?.trim() ?? '',
        price: el.querySelector('.a-price .a-offscreen')?.innerText?.trim() ?? '',
        rating: el.querySelector('.a-icon-alt')?.innerText?.trim() ?? '',
      }))
  );

  console.log(JSON.stringify(products, null, 2));
} finally {
  await browser.close();
}
