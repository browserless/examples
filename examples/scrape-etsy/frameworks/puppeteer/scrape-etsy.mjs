// Scrapes Etsy product listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-etsy.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.etsy.com/search?q=candles', {
    waitUntil: 'networkidle2',
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
