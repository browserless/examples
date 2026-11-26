// Scrapes Reddit posts from a subreddit using Puppeteer with stealth mode.
//
// Install: npm install puppeteer-core
// Run:     node scrape-reddit.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
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
