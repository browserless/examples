// Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
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
    waitUntil: 'networkidle2',
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
