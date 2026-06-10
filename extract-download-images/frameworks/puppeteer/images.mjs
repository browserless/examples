// Extracts all <img> src URLs from the fully rendered DOM, then downloads each
// image to an images/ directory. Useful when images are lazy-loaded or injected
// by JavaScript after initial page load.
//
// Install: npm install puppeteer-core
// Run:     node images.mjs

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });

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
