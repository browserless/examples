// Automates a login flow using Playwright with solveCaptchas=true.
// Tries multiple email field selectors — login pages don't use a consistent
// attribute, so falling back through a list is more reliable than a single selector.
// Reads the password from an environment variable to avoid hardcoding credentials.
//
// Install: npm install playwright-core
// Run:     PASSWORD=your_password node agent-login.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}&solveCaptchas=true`
);

try {
  // Use the default context — browser.newPage() creates a new context that
  // doesn't inherit proxy, profile, or launch settings.
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://app.example.com/login', { waitUntil: 'networkidle' });

  // Try multiple selectors — login pages don't use a consistent attribute for the email field.
  const emailSelectors = ['input[type="email"]', 'input[name="email"]', '#email'];
  for (const sel of emailSelectors) {
    if (await page.locator(sel).count() > 0) {
      await page.fill(sel, 'user@example.com');
      break;
    }
  }

  await page.fill('input[type="password"]', process.env.PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  console.log('Logged in. Current URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
