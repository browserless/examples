// Scrapes Yelp business listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-yelp.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
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
