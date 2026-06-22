// Scrapes Reddit posts from a subreddit using Playwright with stealth mode.
//
// Install: npm install playwright-core
// Run:     node scrape-reddit.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.reddit.com/r/programming/', {
    waitUntil: 'networkidle',
  });

  await page.waitForTimeout(2000);

  const posts = await page.evaluate(() =>
    Array.from(document.querySelectorAll('article')).map((article) => ({
      title: article.querySelector('[id*="post-title"]')?.innerText?.trim() ?? '',
      score: article.querySelector('[id*="vote-arrows"]')?.innerText?.trim() ?? '',
      comments: article.querySelector('a[data-click-id="comments"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(posts, null, 2));
} finally {
  await browser.close();
}
