// End-to-end test using Puppeteer connected to a remote Browserless browser.
//
// Install: npm install puppeteer-core
// Run:     node e2e-testing.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

const results = [];

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'networkidle2' });

  const title = await page.title();
  results.push({
    test: 'title includes "Product Catalog"',
    passed: title.includes('Product Catalog'),
  });

  const heading = await page.$eval('h1', el => el.textContent.trim());
  results.push({
    test: 'h1 reads "Product Catalog"',
    passed: heading === 'Product Catalog',
  });

  const link = await page.$('a[href]');
  results.push({
    test: 'page has at least one link',
    passed: link !== null,
  });
} finally {
  await browser.close();
}

const failed = results.filter(r => !r.passed);
results.forEach(r => console.log(`${r.passed ? '✓' : '✗'} ${r.test}`));
if (failed.length) {
  console.error(`\n${failed.length} test(s) failed`);
  process.exit(1);
}
