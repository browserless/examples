// Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
//
// Install: npm install puppeteer-core
// Run:     node scrape-indeed-jobs.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.indeed.com/jobs?q=data+scientist&l=Remote', {
    waitUntil: 'networkidle2',
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
