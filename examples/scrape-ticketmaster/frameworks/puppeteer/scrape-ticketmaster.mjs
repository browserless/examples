// Scrapes Ticketmaster event listings using Puppeteer with stealth mode and residential proxy.
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
