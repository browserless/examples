// Scrapes YouTube search results using Playwright with stealth mode.
//
// Install: npm install playwright-core
// Run:     node scrape-youtube.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(
    'https://www.youtube.com/results?search_query=javascript+tutorial',
    { waitUntil: 'networkidle' }
  );

  await page.waitForTimeout(2000);

  const videos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('ytd-video-renderer')).map((card) => ({
      title: card.querySelector('#video-title')?.innerText?.trim() ?? '',
      channel: card.querySelector('[id="channel-name"]')?.innerText?.trim() ?? '',
      views: card.querySelector('span.inline-metadata-item')?.innerText?.trim() ?? '',
      url: card.querySelector('a#video-title')?.href ?? '',
    }))
  );

  console.log(JSON.stringify(videos, null, 2));
} finally {
  await browser.close();
}
