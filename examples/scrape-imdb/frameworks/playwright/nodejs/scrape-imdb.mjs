// Scrapes IMDb top movie ratings using BQL with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-imdb.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.imdb.com/chart/top/', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('.ipc-metadata-list-summary-item');

  const movies = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.ipc-metadata-list-summary-item')).map((item) => ({
      title: item.querySelector('.ipc-title__text')?.innerText?.trim() ?? '',
      metadata: Array.from(item.querySelectorAll('.cli-title-metadata span')).map((s) => s.innerText.trim()),
      rating: item.querySelector('.ipc-rating-star--imdb')?.getAttribute('aria-label') ?? '',
    }))
  );

  console.log(JSON.stringify(movies, null, 2));
} finally {
  await browser.close();
}
