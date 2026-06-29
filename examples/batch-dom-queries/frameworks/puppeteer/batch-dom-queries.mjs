// Runs multiple DOM queries in a single browser session using Puppeteer.
//
// Install: npm install puppeteer-core
// Run:     node batch-dom-queries.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto('https://scraping-sandbox.netlify.app/products', { waitUntil: 'networkidle2' });

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
