// Scrapes LinkedIn job listings using BQL with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-linkedin-jobs.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.linkedin.com/jobs/search/?keywords=software+engineer&location=United+States', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('.base-card');

  const jobs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.base-card')).map((card) => ({
      title: card.querySelector('.base-search-card__title')?.innerText?.trim() ?? '',
      company: card.querySelector('.base-search-card__subtitle a')?.innerText?.trim() ?? '',
      location: card.querySelector('.job-search-card__location')?.innerText?.trim() ?? '',
      posted: card.querySelector('time')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(jobs, null, 2));
} finally {
  await browser.close();
}
