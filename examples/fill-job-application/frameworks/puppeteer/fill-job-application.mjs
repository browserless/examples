// Fills and submits a job application form on a sandbox site.
//
// Install: npm install puppeteer-core
// Run:     node fill-job-application.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines', {
    waitUntil: 'networkidle2',
  });

  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.evaluate((el) => el.innerText);
    if (text.trim() === 'Application') {
      await btn.click();
      break;
    }
  }

  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', 'Jane Smith');
  await page.type('input[type="email"]', 'jane@example.com');
  await page.type('textarea', 'Excited to contribute to the team!');

  const submitButtons = await page.$$('button');
  for (const btn of submitButtons) {
    const text = await btn.evaluate((el) => el.innerText);
    if (text.trim() === 'Submit Application') {
      await btn.click();
      break;
    }
  }

  console.log('Application submitted successfully');
} finally {
  await browser.close();
}
