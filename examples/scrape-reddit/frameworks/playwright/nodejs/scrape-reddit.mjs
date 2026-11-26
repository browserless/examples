// Scrapes Reddit posts from a subreddit using Playwright with stealth mode.
//
// Install: npm install playwright-core
// Run:     node scrape-reddit.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.reddit.com/r/programming/', {
    waitUntil: 'domcontentloaded',
  });

  // Wait for posts to render before reading attributes.
  await page.waitForSelector('shreddit-post');

  const posts = await page.evaluate(() =>
    Array.from(document.querySelectorAll('shreddit-post')).map((post) => ({
      title: post.getAttribute('post-title'),
      score: post.getAttribute('score'),
      commentCount: post.getAttribute('comment-count'),
      permalink: post.getAttribute('permalink'),
    }))
  );

  console.log(JSON.stringify(posts, null, 2));
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
