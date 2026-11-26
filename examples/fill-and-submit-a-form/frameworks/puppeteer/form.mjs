// Fills and submits a form via a live Puppeteer browser session.
// Uses waitForNavigation after click to confirm the form was processed.
//
// Install: npm install puppeteer-core
// Run:     node form.mjs

import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://httpbin.org/forms/post', { waitUntil: 'domcontentloaded' });

  await page.type('input[name="custname"]', 'Jane Doe');
  await page.type('input[name="custemail"]', 'jane@example.com');
  await page.click('input[value="medium"]');
  await page.click('input[value="cheese"]');
  await page.type('textarea[name="comments"]', 'Hello from Browserless!');

  // Register the navigation wait before clicking so the page load can't be missed.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('form button'),
  ]);

  // httpbin echoes the submission as JSON; `form` holds the posted fields.
  const body = await page.evaluate(() => document.body.innerText);
  console.log(JSON.parse(body).form);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
