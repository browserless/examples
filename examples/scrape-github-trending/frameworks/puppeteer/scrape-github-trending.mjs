// Scrapes GitHub trending repositories using BQL.
//
// Install: npm install puppeteer-core
// Run:     node scrape-github-trending.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://github.com/trending', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('article.Box-row');

  const repos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('article.Box-row')).map((row) => ({
      name: row.querySelector('h2 a')?.innerText?.trim() ?? '',
      description: row.querySelector('p')?.innerText?.trim() ?? '',
      language: row.querySelector('[itemprop="programmingLanguage"]')?.innerText?.trim() ?? '',
      stars: row.querySelector('a[href*="stargazers"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(repos, null, 2));
} finally {
  await browser.close();
}
