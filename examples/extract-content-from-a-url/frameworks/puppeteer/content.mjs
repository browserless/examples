// Fetches the fully rendered HTML of a page via a live Puppeteer browser session.
// Use this approach when you need to interact with the page before extracting content.
//
// Install: npm install puppeteer-core
// Run:     node content.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log(html.slice(0, 500));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
