// Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-opentable.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.opentable.com/s?term=italian&covers=2', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('[data-test=restaurant-card]');

  const restaurants = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test="restaurant-card"]')).map((card) => ({
      name: card.querySelector('h2')?.innerText?.trim() ?? '',
      rating: card.querySelector('[data-test="rating-score"]')?.innerText?.trim() ?? '',
      cuisine: card.querySelector('[data-test="cuisine"]')?.innerText?.trim() ?? '',
      priceRange: card.querySelector('[data-test="price-range"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(restaurants, null, 2));
} finally {
  await browser.close();
}
