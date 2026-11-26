// Scrapes Indeed job listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-indeed-jobs.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.indeed.com/jobs?q=data+scientist&l=Remote', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('.job_seen_beacon');

  const jobs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.job_seen_beacon')).map((card) => ({
      title: card.querySelector('.jobTitle a span')?.innerText?.trim() ?? '',
      company: card.querySelector('[data-testid=company-name]')?.innerText?.trim() ?? '',
      location: card.querySelector('[data-testid=text-location]')?.innerText?.trim() ?? '',
      salary: card.querySelector('.salary-snippet-container')?.innerText?.trim() ?? '',
      link: card.querySelector('.jobTitle a')?.href ?? '',
    }))
  );

  console.log(JSON.stringify(jobs, null, 2));
} finally {
  await browser.close();
}
