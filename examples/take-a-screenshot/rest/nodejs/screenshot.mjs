// Captures a webpage as a PNG using the Browserless /screenshot endpoint.
// Uses Node.js 18+ native fetch — no extra packages needed.
//
// Run: node screenshot.mjs

import fs from 'fs/promises';

const response = await fetch(
  'https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'https://scraping-sandbox.netlify.app/receipt',
      options: { fullPage: true, type: 'png' },
    }),
  }
);
const buffer = await response.arrayBuffer();
await fs.writeFile('screenshot.png', Buffer.from(buffer));
console.log('Screenshot saved as screenshot.png.');
