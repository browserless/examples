// Scrapes Zillow property listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-zillow.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.zillow.com/new-york-ny/', {
    waitUntil: 'networkidle2',
  });

  await new Promise((r) => setTimeout(r, 3000));

  const listings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test="property-card"]')).map((card) => ({
      address: card.querySelector('[data-test="property-card-addr"]')?.innerText?.trim() ?? '',
      price: card.querySelector('[data-test="property-card-price"]')?.innerText?.trim() ?? '',
      details: card.querySelector('.StyledPropertyCardHomeDetails')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(listings, null, 2));
} finally {
  await browser.close();
}
