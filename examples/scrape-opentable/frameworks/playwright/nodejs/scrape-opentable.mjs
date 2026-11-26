// Scrapes OpenTable restaurant listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-opentable.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.opentable.com/s?term=italian&covers=2', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Results render client-side a few seconds after the DOM loads.
  await page.waitForSelector('[data-test="restaurant-card"]:has(h6)', { timeout: 60000 });

  const restaurants = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test="restaurant-card"]:has(h6)')).map((card) => ({
      name: card.querySelector('h6')?.innerText?.trim() ?? '',
      // The summary line reads "4.8 (1,573) • $$ • Italian • <neighborhood>".
      rating: card.querySelector('[data-testid="search-list-card-content-container"] > div:nth-child(2)')
        ?.innerText?.trim().split(' ')[0] ?? '',
      cuisine: card.querySelector('[aria-label^="Price"] + span')?.innerText?.trim() ?? '',
      priceRange: card.querySelector('[aria-label^="Price"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(restaurants, null, 2));
} finally {
  await browser.close();
}
