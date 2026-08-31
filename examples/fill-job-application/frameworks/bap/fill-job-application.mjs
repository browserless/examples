// Fills out and submits a job application form with BAP.
// Each call returns once the server has applied it, so the steps stay in
// order without manual waits between them.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node fill-job-application.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines', { waitUntil: 'networkIdle' });

  await page.click('button:nth-child(2)');
  await page.waitForSelector('input[type=text]', { timeout: 10000 });

  await page.type('input[type=text]', 'Jane Smith');
  await page.type('input[type=email]', 'jane@example.com');
  await page.type('textarea', 'Excited to contribute to the team!');

  await page.click('div > button:only-of-type');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
