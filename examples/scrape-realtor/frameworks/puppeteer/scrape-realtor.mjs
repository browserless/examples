// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-realtor.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.realtor.com/realestateandhomes-search/San-Francisco_CA', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('[data-testid=card-content]');

  const properties = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="card-content"]')).map((card) => ({
      price: card.querySelector('[data-testid="card-price"]')?.innerText?.trim() ?? '',
      address: card.querySelector('[data-testid="card-address"]')?.innerText?.trim() ?? '',
      beds: card.querySelector('[data-testid="property-meta-beds"] span')?.innerText?.trim() ?? '',
      baths: card.querySelector('[data-testid="property-meta-baths"] span')?.innerText?.trim() ?? '',
      sqft: card.querySelector('[data-testid="property-meta-sqft"] span')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(properties, null, 2));
} finally {
  await browser.close();
}
