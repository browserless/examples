// Scrapes title, channel, views, likes, and upload date from a YouTube video with BAP.
// Each $eval is one operation on the same connection, so the five fields cost
// one round trip each and no extra sessions.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node scrape-youtube.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { waitUntil: 'domContentLoaded' });
  await page.waitForSelector('#view-count[aria-label]', { timeout: 20000 });

  console.log({
    title: await page.$eval('h1.ytd-watch-metadata yt-formatted-string'),
    channel: await page.$eval('ytd-channel-name yt-formatted-string a'),
    // Views and likes render as animated counters, so read their accessible labels instead.
    views: await page.evaluate(
      `document.querySelector('#view-count').getAttribute('aria-label')`
    ),
    likes: await page.evaluate(
      `document.querySelector('#top-level-buttons-computed like-button-view-model button').getAttribute('aria-label')`
    ),
    uploadDate: await page.$eval('#info-strings yt-formatted-string'),
  });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
