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
  await page.goto('https://www.browserless.io/practice-form', {
    waitUntil: 'networkidle2',
  });

  await page.type('#Email', 'user@example.com');
  await page.type('#Message', 'Hello from Browserless!');
  await page.select('select#Subject', 'Support');
  await page.click("button[type='submit']");
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  console.log('Form submitted, current URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
