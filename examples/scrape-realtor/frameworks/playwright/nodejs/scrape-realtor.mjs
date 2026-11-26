// Scrapes Realtor.com property listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-realtor.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.realtor.com/realestateandhomes-search/San-Francisco_CA', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('[data-testid="property-card"]');

  const properties = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="property-card"]')).map((card) => ({
      price: card.querySelector('.fs_700')?.innerText?.trim() ?? '',
      // The card link's screen-reader text reads "property detail for <address>".
      address: card.querySelector('a .sr_true')?.innerText?.replace('property detail for ', '').trim() ?? '',
      beds: card.querySelector('[data-testid="property-meta-beds"] [data-testid="meta-value"]')?.innerText?.trim() ?? '',
      baths: card.querySelector('[data-testid="property-meta-baths"] [data-testid="meta-value"]')?.innerText?.trim() ?? '',
      sqft: card.querySelector('[data-testid="property-meta-sqft"] [data-testid="meta-value"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(properties, null, 2));
} finally {
  await browser.close();
}
