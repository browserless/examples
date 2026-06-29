// Captures screenshots of multiple pages concurrently using the Browserless REST API.
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
//
// Run: node concurrent.mjs

import fs from 'fs';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const URLS = [
  'https://scraping-sandbox.netlify.app/products',
  'https://scraping-sandbox.netlify.app/contact-us',
  'https://scraping-sandbox.netlify.app/receipt',
  'https://scraping-sandbox.netlify.app/dashboard',
  'https://scraping-sandbox.netlify.app/helix',
];

await Promise.all(
  URLS.map((url, i) =>
    fetch(`https://production-sfo.browserless.io/screenshot?token=${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, options: { type: 'png', fullPage: true } }),
    }).then(async (res) => {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(`screenshot-${i + 1}.png`, buf);
      console.log(`Saved screenshot-${i + 1}.png`);
    })
  )
);

console.log('All done');
