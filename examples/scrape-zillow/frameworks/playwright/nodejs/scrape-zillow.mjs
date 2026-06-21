// Scrapes Zillow property listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-zillow.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.zillow.com/new-york-ny/', {
    waitUntil: 'networkidle',
  });

  await page.waitForTimeout(3000);

  const listings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test="property-card"]')).map((card) => ({
      address: card.querySelector('[data-test="property-card-addr"]')?.innerText?.trim() ?? '',
      price: card.querySelector('[data-test="property-card-price"]')?.innerText?.trim() ?? '',
      details: card.querySelector('.StyledPropertyCardHomeDetails')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(listings, null, 2));
} finally {
  await browser.close();
}
