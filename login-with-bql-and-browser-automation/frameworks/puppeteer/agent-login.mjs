// Automates a login flow using Puppeteer with solveCaptchas=true.
// Tries multiple email field selectors — login pages don't use a consistent
// attribute, so falling back through a list is more reliable than a single selector.
// Reads the password from an environment variable to avoid hardcoding credentials.
//
// Install: npm install puppeteer-core
// Run:     PASSWORD=your_password node agent-login.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    `wss://production-sfo.browserless.io?token=${TOKEN}&solveCaptchas=true`,
});

try {
  const page = await browser.newPage();
  await page.goto('https://app.example.com/login', { waitUntil: 'networkidle2' });

  // Try multiple selectors — login pages don't use a consistent attribute for the email field.
  const emailSelectors = ['input[type="email"]', 'input[name="email"]', '#email'];
  for (const sel of emailSelectors) {
    if (await page.$(sel)) {
      await page.type(sel, 'user@example.com');
      break;
    }
  }

  await page.type('input[type="password"]', process.env.PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Logged in. Current URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
