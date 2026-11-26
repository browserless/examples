// Scrapes title, channel, views, likes, and upload date from a YouTube video page using Puppeteer with stealth mode.
//
// Install: npm install puppeteer-core
// Run:     node scrape-youtube.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
    waitUntil: 'domcontentloaded',
  });

  // Wait for the view count to confirm the video metadata has rendered.
  await page.waitForSelector('#view-count[aria-label]');

  // Batch all reads into one evaluate() call to avoid multiple round-trips.
  const data = await page.evaluate(() => ({
    title: document.querySelector('h1.ytd-watch-metadata yt-formatted-string')?.textContent?.trim() ?? null,
    channel: document.querySelector('ytd-channel-name yt-formatted-string a')?.textContent?.trim() ?? null,
    // Views and likes render as animated counters, so read their accessible labels instead.
    views: document.querySelector('#view-count')?.getAttribute('aria-label')?.trim() ?? null,
    likes: document.querySelector('#top-level-buttons-computed like-button-view-model button')
      ?.getAttribute('aria-label') ?? null,
    uploadDate: document.querySelector('#info-strings yt-formatted-string')?.textContent?.trim() ?? null,
  }));

  console.log(JSON.stringify(data, null, 2));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
