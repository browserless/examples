// Scrapes Booking.com hotel listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-booking.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto(
    'https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2',
    { waitUntil: 'networkidle2' }
  );

  await new Promise((r) => setTimeout(r, 3000));

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
