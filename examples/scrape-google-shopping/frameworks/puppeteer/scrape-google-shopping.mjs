// Scrapes Google Shopping results using Puppeteer with stealth mode.
//
// Install: npm install puppeteer-core
// Run:     node scrape-google-shopping.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto(
    'https://www.google.com/search?q=wireless+headphones&tbm=shop',
    { waitUntil: 'networkidle2' }
  );

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.sh-dgr__grid-result')).map((card) => ({
      title: card.querySelector('h3.tAxDx')?.innerText?.trim() ?? '',
      price: card.querySelector('.a8Pemb')?.innerText?.trim() ?? '',
      store: card.querySelector('.aULzUe')?.innerText?.trim() ?? '',
      rating: card.querySelector('.Rsc7Yb')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(products, null, 2));
} finally {
  await browser.close();
}
