// Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-indeed-jobs.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE&stealth&proxy=residential&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://www.indeed.com/jobs?q=data+scientist&l=Remote', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('.job_seen_beacon');

  const jobs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.job_seen_beacon')).map((card) => ({
      title: card.querySelector('.jobTitle a span')?.innerText?.trim() ?? '',
      company: card.querySelector('.companyName')?.innerText?.trim() ?? '',
      location: card.querySelector('.companyLocation')?.innerText?.trim() ?? '',
      salary: card.querySelector('.salary-snippet-container')?.innerText?.trim() ?? '',
    }))
  );

  console.log(JSON.stringify(jobs, null, 2));
} finally {
  await browser.close();
}
