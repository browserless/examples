// Scrapes Glassdoor job listings using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-glassdoor.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(
    'https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm',
    { waitUntil: 'networkidle' }
  );

  const jobs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test="jobListing"]')).map((card) => ({
      title: card.querySelector('a[data-test="job-title"]')?.innerText?.trim() ?? '',
      company: card.querySelector('[data-test="employer-name"]')?.innerText?.trim() ?? '',
      location: card.querySelector('[data-test="emp-location"]')?.innerText?.trim() ?? '',
      salary: card.querySelector('[data-test="detailSalary"]')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(jobs, null, 2));
} finally {
  await browser.close();
}
