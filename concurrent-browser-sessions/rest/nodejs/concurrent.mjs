// Captures screenshots of multiple pages concurrently using the Browserless REST API.
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
//
// Run: node concurrent.mjs

import fs from 'fs';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const URLS = [
  'https://example.com/page/1',
  'https://example.com/page/2',
  'https://example.com/page/3',
  'https://example.com/page/4',
  'https://example.com/page/5',
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
