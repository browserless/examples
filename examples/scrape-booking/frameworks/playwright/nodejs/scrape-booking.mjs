// Scrapes Booking.com hotel listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-booking.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(
    'https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2',
    { waitUntil: 'networkidle' }
  );

  await page.waitForTimeout(3000);

  const hotels = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="property-card"]')).map((card) => ({
      name: card.querySelector('[data-testid="title"]')?.innerText?.trim() ?? '',
      price: card.querySelector('[data-testid="price-and-discounted-price"]')?.innerText?.trim() ?? '',
      rating: card.querySelector('[data-testid="review-score"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(hotels, null, 2));
} finally {
  await browser.close();
}
