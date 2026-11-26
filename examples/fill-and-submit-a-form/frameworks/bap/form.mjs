// Fills out and submits the httpbin.org sample form with BAP, then prints the posted fields.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node form.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://httpbin.org/forms/post', { waitUntil: 'domContentLoaded' });

  await page.type('input[name="custname"]', 'Jane Doe');
  await page.type('input[name="custemail"]', 'jane@example.com');
  await page.click('input[value="medium"]');
  await page.check('input[value="cheese"]');
  await page.type('textarea[name="comments"]', 'Hello from Browserless!');

  // With waitUntil, click() returns after the navigation it triggers has loaded.
  await page.click('form button', { waitUntil: 'domContentLoaded' });

  // httpbin echoes the submission as JSON; `form` holds the posted fields.
  const body = await page.$eval('body');
  console.log(JSON.parse(body).form);
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
