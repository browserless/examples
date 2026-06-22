// Routes browser traffic through a residential proxy using Playwright.
// The proxy is configured at the connection level — all pages share the same proxy IP.
//
// Install: npm install playwright-core
// Run:     node proxy.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connect(
  'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us'
);

try {
  const page = await browser.newPage();
  await page.goto('https://api.ipify.org?format=json', { waitUntil: 'networkidle' });
  const ip = await page.evaluate(() => JSON.parse(document.body.innerText).ip);
  console.log('Proxy IP:', ip);
} finally {
  await browser.close();
}
