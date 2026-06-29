// Connects to Browserless by replacing puppeteer.launch() with puppeteer.connect().
// Use puppeteer-core — it skips bundling local browser binaries.
//
// Install: npm install puppeteer-core
// Run:     node script.mjs

// Before — runs a local browser.
// const browser = await puppeteer.launch();

// After — runs on Browserless.
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});
try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'networkidle2' });
  console.log('Title:', await page.title());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
