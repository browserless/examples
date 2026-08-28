// Logs into a website with BAP, solving any CAPTCHA the login form presents.
// Reads the password from an environment variable to avoid hardcoding credentials.
//
// Install: npm install @browserless.io/bap-ts
// Run:     PASSWORD=your_password node agent-login.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://app.example.com/login');

  const emailSelector = 'input[type=email], input[name=email], #email';
  await page.waitForSelector(emailSelector);

  await page.type(emailSelector, 'user@example.com');
  await page.type('input[type=password]', process.env.PASSWORD);

  // Clears a CAPTCHA if the login form presents one.
  await page.solve();

  await page.click('button[type=submit]');
  await page.waitForNavigation();

  console.log(await page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
