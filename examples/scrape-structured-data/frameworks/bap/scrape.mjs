// Scrapes structured data from a page with BAP.
// mapSelector runs server-side and returns element properties for every match.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node scrape.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'domContentLoaded' });

  const [heading] = await page.mapSelector('h1');
  const products = await page.mapSelector('.product-title');

  console.log({
    heading: heading?.innerText,
    products: products.map((product) => product.innerText),
  });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
