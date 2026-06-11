// Extracts all <img> src URLs from the fully rendered DOM, then downloads each
// image to an images/ directory. Useful when images are lazy-loaded or injected
// by JavaScript after initial page load.
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
  // Use the default context — browser.newPage() creates a new context that
  // doesn't inherit proxy, profile, or launch settings.
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });

  const imageUrls = await page.evaluate(() =>
    Array.from(document.querySelectorAll('img'))
      .map((img) => img.src)
      .filter((src) => src.startsWith('http'))
  );

  console.log(`Found ${imageUrls.length} images`);
  fs.mkdirSync('images', { recursive: true });

  for (const [i, url] of imageUrls.entries()) {
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    fs.writeFileSync(`images/image-${i}${ext}`, buf);
    console.log(`Saved image-${i}${ext}`);
  }
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
