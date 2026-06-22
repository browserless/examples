// Scrapes Google Shopping results using Playwright with stealth mode.
//
// Install: npm install playwright-core
// Run:     node scrape-google-shopping.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(
    'https://www.google.com/search?q=wireless+headphones&tbm=shop',
    { waitUntil: 'networkidle' }
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
