// Scrapes Glassdoor job listings using Puppeteer with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-glassdoor.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto(
    'https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm',
    { waitUntil: 'networkidle2' }
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
