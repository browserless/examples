// Runs multiple DOM queries in a single browser session using Playwright.
//
// Install: npm install playwright-core
// Run:     node batch-dom-queries.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });

  // Run all queries in a single evaluate call to minimise round-trips.
  const results = await page.evaluate(() => ({
    title: document.title,
    heading: document.querySelector('h1')?.innerText ?? '',
    description: document.querySelector('meta[name="description"]')?.content ?? '',
    links: Array.from(document.querySelectorAll('a')).map((a) => ({
      text: a.innerText.trim(),
      href: a.href,
    })),
  }));

  console.log('Title:', results.title);
  console.log('H1:', results.heading);
  console.log('Description:', results.description);
  console.log('Links:', results.links);
} finally {
  await browser.close();
}
