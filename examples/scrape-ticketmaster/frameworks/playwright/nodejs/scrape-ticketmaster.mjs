// Scrapes Ticketmaster event listings using Playwright with stealth mode and residential proxy.
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
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('[data-testid="eventList"] > li');

  const events = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="eventList"] > li')).map((card) => ({
      name: card.querySelector('button[aria-controls="eventOverflow"] + span')?.innerText?.trim() ?? '',
      date: card.querySelector('li > div > div > span:first-child')?.innerText?.trim() ?? '',
      venue: card.querySelector('button[aria-controls="eventOverflow"] + span + span span:last-child')?.innerText?.trim() ?? '',
      link: card.querySelector('[data-testid="event-list-link"]')?.href ?? '',
    }))
  );

  console.log(JSON.stringify(events, null, 2));
} finally {
  await browser.close();
}
