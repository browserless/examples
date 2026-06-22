// Scrapes Reddit posts from a subreddit using Puppeteer with stealth mode.
//
// Install: npm install puppeteer-core
// Run:     node scrape-reddit.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.reddit.com/r/programming/', {
    waitUntil: 'networkidle2',
  });

  await new Promise((r) => setTimeout(r, 2000));

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
