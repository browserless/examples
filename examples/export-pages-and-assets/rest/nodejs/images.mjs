// Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
// using the Browserless /export endpoint.
//
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
// Run: node images.mjs

import fs from 'fs';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const response = await fetch(
  `https://production-sfo.browserless.io/export?token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://scraping-sandbox.netlify.app/harvest-direct',
      includeResources: true,
    }),
  }
);

const buf = Buffer.from(await response.arrayBuffer());
fs.writeFileSync('page.zip', buf);
console.log('Saved page.zip');
