// Opens multiple independent Puppeteer browser sessions on Browserless in parallel.
// Each puppeteer.connect() call creates a separate managed browser — no shared state.
//
// Install: npm install puppeteer-core
// Run:     node concurrent.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const WS = `wss://production-sfo.browserless.io?token=${TOKEN}`;
const URLS = [
  'https://example.com/page/1',
  'https://example.com/page/2',
  'https://example.com/page/3',
  'https://example.com/page/4',
  'https://example.com/page/5',
];

const results = await Promise.all(
  URLS.map(async (url, i) => {
    const browser = await puppeteer.connect({ browserWSEndpoint: WS });
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const title = await page.title();
      console.log(`[${i + 1}] ${title}`);
      return { url, title };
    } finally {
      // Always close to release the session even on error.
      await browser.close();
    }
  })
);

console.log('Results:', results);
