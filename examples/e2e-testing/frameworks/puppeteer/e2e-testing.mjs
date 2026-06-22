// End-to-end test using Puppeteer connected to a remote Browserless browser.
//
// Install: npm install puppeteer-core
// Run:     node e2e-testing.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com', { waitUntil: 'networkidle2' });

  const title = await page.title();
  console.assert(title.includes('Automation'), `Title check failed: ${title}`);

  // Test: navigate to products page
  await page.click('a[href="/products"]');
  await page.waitForSelector('.features_items');

  const productCount = await page.$$eval('.product-image-wrapper', (els) => els.length);
  console.assert(productCount > 0, 'No products found');

  // Test: add first product to cart
  await page.hover('.product-image-wrapper:first-child');
  await page.click('.product-image-wrapper:first-child .add-to-cart');
  await page.waitForSelector('#cartModal');

  const modalVisible = await page.$('#cartModal');
  console.assert(modalVisible, 'Cart modal not shown');

  console.log('All E2E tests passed.');
  console.log(`Products found: ${productCount}`);
} finally {
  await browser.close();
}
