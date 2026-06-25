// Fills and submits a job application form on a sandbox site using BQL.
//
// Install: npm install playwright-core
// Run:     node fill-job-application.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/helix', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('form');
  await page.fill('input[name="name"]', 'Jane Smith');
  await page.fill('input[name="email"]', 'jane@example.com');
  await page.fill('input[name="phone"]', '555-123-4567');
  await page.selectOption('select[name="department"]', 'Engineering');
  await page.fill('textarea[name="message"]', 'Excited to contribute to the team!');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  console.log('Application submitted, current URL:', page.url());
} finally {
  await browser.close();
}
