// Captures a webpage as a PNG via a live Puppeteer browser session.
// Use this approach when you need to interact with the page before capturing.
//
// Install: npm install puppeteer-core
// Run:     node screenshot.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('Screenshot saved as screenshot.png.');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
