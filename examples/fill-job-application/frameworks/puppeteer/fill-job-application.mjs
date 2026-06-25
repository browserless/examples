// Fills and submits a job application form on a sandbox site using BQL.
//
// Install: npm install puppeteer-core
// Run:     node fill-job-application.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/helix', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('form');
  await page.type('input[name="name"]', 'Jane Smith');
  await page.type('input[name="email"]', 'jane@example.com');
  await page.type('input[name="phone"]', '555-123-4567');
  await page.select('select[name="department"]', 'Engineering');
  await page.type('textarea[name="message"]', 'Excited to contribute to the team!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  console.log('Application submitted, current URL:', page.url());
} finally {
  await browser.close();
}
