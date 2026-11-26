// Scrapes Yelp business listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-yelp.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('[data-testid="serp-ia-card"]');

  const businesses = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="serp-ia-card"]')).map((card) => ({
      name: card.querySelector('[class*="businessName"] a')?.innerText?.trim() ?? '',
      rating: card.querySelector('[aria-label*="star"]')?.getAttribute('aria-label') ?? '',
      reviewCount: card.querySelector('[data-traffic-crawl-id="SearchResultBizRating"] span:last-child')?.innerText?.trim() ?? '',
      categories: card.querySelector('[data-testid="services-actions-component"] a[href*="find_desc"]')?.innerText?.trim() ?? '',
      priceRange: card.querySelector('[class*="icon--16-marker"] + span + span:not([data-font-weight])')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(businesses, null, 2));
} finally {
  await browser.close();
}
