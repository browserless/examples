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
  // Booking.com only shows prices for future stays, so search 30 days from today.
  const day = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
  await page.goto(
    `https://www.booking.com/searchresults.html?ss=New+York&checkin=${day(30)}&checkout=${day(31)}&group_adults=2`,
    { waitUntil: 'domcontentloaded' }
  );

  // Wait for property cards to confirm the listings have rendered.
  await page.waitForSelector('[data-testid="property-card"]');

  const hotels = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="property-card"]')).map((card) => ({
      name: card.querySelector('[data-testid="title"]')?.innerText?.trim() ?? null,
      price: card.querySelector('[data-testid="price-and-discounted-price"]')?.innerText?.trim() ?? null,
      rating: card.querySelector('[data-testid="review-score"] [aria-hidden="true"]')?.innerText?.trim() ?? null,
      location: card.querySelector('[data-testid="address-link"]')?.innerText?.trim() ?? null,
    }))
  );

  console.log(JSON.stringify(hotels, null, 2));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
