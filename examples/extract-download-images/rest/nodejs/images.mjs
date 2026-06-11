// Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
// then downloads each image to an images/ directory.
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
//
// Run: node images.mjs

import fs from 'fs';
import path from 'path';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const scrapeRes = await fetch(
  `https://production-sfo.browserless.io/scrape?token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example.com',
      elements: [{ selector: 'img', timeout: 5000 }],
    }),
  }
);

const { data } = await scrapeRes.json();

// src is nested inside each result's attributes array.
const imageUrls = data[0].results
  .flatMap((r) => r.attributes)
  .filter((a) => a.name === 'src' && a.value.startsWith('http'))
  .map((a) => a.value);

console.log(`Found ${imageUrls.length} images`);
fs.mkdirSync('images', { recursive: true });

for (const [i, url] of imageUrls.entries()) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = path.extname(new URL(url).pathname) || '.jpg';
  fs.writeFileSync(`images/image-${i}${ext}`, buf);
  console.log(`Saved image-${i}${ext}`);
}
