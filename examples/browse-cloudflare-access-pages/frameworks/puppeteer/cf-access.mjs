// Accesses a Cloudflare Access-protected page by injecting Service Token headers
// before navigation. Headers are required on every request to the protected origin.
//
// Install: npm install puppeteer-core
// Run:     node cf-access.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'CF-Access-Client-Id': 'YOUR_CF_CLIENT_ID.access',
    'CF-Access-Client-Secret': 'YOUR_CF_CLIENT_SECRET',
  });
  await page.goto('https://internal.example.com/dashboard', {
    waitUntil: 'networkidle2',
  });
  console.log('Title:', await page.title());
  await page.screenshot({ path: 'dashboard.png' });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
