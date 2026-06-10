// Accesses a Cloudflare Access-protected page by injecting Service Token headers
// via extraHTTPHeaders on a new context. Headers are sent on every request within
// that context.
//
// Install: npm install playwright-core
// Run:     node cf-access.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  const context = await browser.newContext({
    extraHTTPHeaders: {
      'CF-Access-Client-Id': 'YOUR_CF_CLIENT_ID.access',
      'CF-Access-Client-Secret': 'YOUR_CF_CLIENT_SECRET',
    },
  });
  const page = await context.newPage();
  await page.goto('https://internal.example.com/dashboard', {
    waitUntil: 'networkidle',
  });
  console.log('Title:', await page.title());
  await page.screenshot({ path: 'dashboard.png' });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
