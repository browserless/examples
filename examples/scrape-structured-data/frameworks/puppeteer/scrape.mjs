// Extracts structured data from a fully rendered page via a live Puppeteer browser session.
// Use this approach when you need custom extraction logic or page interaction before scraping.
//
// Install: npm install puppeteer-core
// Run:     node scrape.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  const data = await page.evaluate(() => ({
    heading: document.querySelector('h1')?.textContent,
    paragraphs: [...document.querySelectorAll('p')].map((el) => el.textContent),
  }));
  console.log(data);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
