// Scrapes IMDb top movie ratings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-imdb.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com/chart/top/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('.ipc-metadata-list-summary-item');

  const movies = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.ipc-metadata-list-summary-item')).map((item) => ({
      title: item.querySelector('.ipc-title__text')?.innerText?.trim() ?? '',
      year: item.querySelector('.cli-title-metadata li')?.innerText?.trim() ?? '',
      rating: item.querySelector('.ipc-rating-star--imdb')?.getAttribute('aria-label') ?? '',
    }))
  );

  console.log(JSON.stringify(movies.slice(0, 10), null, 2));
} finally {
  await browser.close();
}
