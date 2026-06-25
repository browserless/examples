// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-ticketmaster.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.ticketmaster.com/search?q=concerts', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('[data-testid=search-event-card]');

  const events = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="search-event-card"]')).map((card) => ({
      name: card.querySelector('[data-testid="event-name"]')?.innerText?.trim() ?? '',
      date: card.querySelector('[data-testid="event-date"]')?.innerText?.trim() ?? '',
      venue: card.querySelector('[data-testid="event-venue"]')?.innerText?.trim() ?? '',
      price: card.querySelector('[data-testid="event-price"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(events, null, 2));
} finally {
  await browser.close();
}
