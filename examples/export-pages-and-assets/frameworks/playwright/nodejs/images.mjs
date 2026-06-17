// Exports a page's HTML and linked assets (CSS, JS, images) to a local directory
// by intercepting network responses as the page loads.
//
// Install: npm install playwright-core
// Run:     node images.mjs

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  const assetPromises = [];

  page.on('response', (response) => {
    const type = response.request().resourceType();
    if (['stylesheet', 'script', 'image', 'font'].includes(type)) {
      assetPromises.push(
        response.body()
          .then((buf) => ({ url: response.url(), buf }))
          .catch(() => null)
      );
    }
  });

  await page.goto('https://example.com', { waitUntil: 'networkidle' });

  const html = await page.content();
  const assets = (await Promise.all(assetPromises)).filter(Boolean);

  fs.mkdirSync('page', { recursive: true });
  fs.writeFileSync('page/index.html', html);
  console.log('Saved page/index.html');

  for (const [i, { url, buf }] of assets.entries()) {
    const ext = path.extname(new URL(url).pathname) || '';
    const filename = `asset-${i}${ext}`;
    fs.writeFileSync(`page/${filename}`, buf);
    console.log(`Saved page/${filename}`);
  }
} finally {
  await browser.close();
}
