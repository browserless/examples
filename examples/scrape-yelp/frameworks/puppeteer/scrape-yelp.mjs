// Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
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
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('[data-testid=serp-ia-card]');

  const businesses = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="serp-ia-card"]')).map((card) => ({
      name: card.querySelector('a[class*="businessName"] span')?.innerText?.trim() ?? '',
      rating: card.querySelector('[aria-label*="star"]')?.getAttribute('aria-label') ?? '',
      reviewCount: card.querySelector('span[class*="reviewCount"]')?.innerText?.trim() ?? '',
      categories: card.querySelector('a[class*="categoryLink"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(businesses, null, 2));
} finally {
  await browser.close();
}
