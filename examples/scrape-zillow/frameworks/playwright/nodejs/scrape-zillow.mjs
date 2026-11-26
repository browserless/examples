// Scrapes real estate agent names and profile URLs from a Zillow agent directory using Playwright with stealth mode and residential proxy.
//
// Install: npm install playwright-core
// Run:     node scrape-zillow.mjs

import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP(
  'wss://production-sfo.browserless.io/stealth?token=YOUR_API_TOKEN_HERE&proxy=residential&proxySticky=true&proxyCountry=us'
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(
    'https://www.zillow.com/professionals/real-estate-agent-reviews/new-york-ny/',
    { waitUntil: 'domcontentloaded' }
  );

  // The agent cards render client-side, so wait for the first one.
  await page.waitForSelector('a[href*="/profile/"] h2');

  const agents = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/profile/"]')).map((link) => ({
      name: link.querySelector('h2')?.innerText?.trim() ?? '',
      profileUrl: link.href,
    }))
  );

  console.log(JSON.stringify(agents, null, 2));
} finally {
  await browser.close();
}
