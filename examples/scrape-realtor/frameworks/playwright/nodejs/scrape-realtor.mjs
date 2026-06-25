// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-realtor.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.realtor.com/realestateandhomes-search/San-Francisco_CA', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('[data-testid=card-content]');

  const properties = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="card-content"]')).map((card) => ({
      price: card.querySelector('[data-testid="card-price"]')?.innerText?.trim() ?? '',
      address: card.querySelector('[data-testid="card-address"]')?.innerText?.trim() ?? '',
      beds: card.querySelector('[data-testid="property-meta-beds"] span')?.innerText?.trim() ?? '',
      baths: card.querySelector('[data-testid="property-meta-baths"] span')?.innerText?.trim() ?? '',
      sqft: card.querySelector('[data-testid="property-meta-sqft"] span')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(properties, null, 2));
} finally {
  await browser.close();
}
