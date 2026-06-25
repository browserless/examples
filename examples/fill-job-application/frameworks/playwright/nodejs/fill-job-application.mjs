// Fills and submits a job application form on a sandbox site.
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
  await page.goto('https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines', {
    waitUntil: 'networkidle',
  });

  await page.getByRole('button', { name: 'Application' }).click();
  await page.waitForSelector('input[type="text"]');
  await page.fill('input[type="text"]', 'Jane Smith');
  await page.fill('input[type="email"]', 'jane@example.com');
  await page.fill('textarea', 'Excited to contribute to the team!');
  await page.getByRole('button', { name: 'Submit Application' }).click();

  console.log('Application submitted successfully');
} finally {
  await browser.close();
}
