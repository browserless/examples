// Scrapes YouTube search results using Puppeteer with stealth mode.
//
// Install: npm install puppeteer-core
// Run:     node scrape-youtube.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto(
    'https://www.youtube.com/results?search_query=javascript+tutorial',
    { waitUntil: 'networkidle2' }
  );

  await new Promise((r) => setTimeout(r, 2000));

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
