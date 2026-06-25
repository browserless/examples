// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-ticketmaster.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.ticketmaster.com/search?q=concerts', {
    waitUntil: 'networkidle',
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
