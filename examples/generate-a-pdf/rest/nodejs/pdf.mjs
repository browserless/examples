// Generates a PDF from a URL using the Browserless /pdf endpoint.
// Uses Node.js 18+ native fetch — no extra packages needed.
//
// Run: node pdf.mjs

import fs from 'fs/promises';

const response = await fetch(
  'https://production-sfo.browserless.io/pdf?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'https://scraping-sandbox.netlify.app/dashboard-report',
      options: {
        displayHeaderFooter: true,
        printBackground: true,
        format: 'A4',
      },
    }),
  }
);
const buffer = await response.arrayBuffer();
await fs.writeFile('output.pdf', Buffer.from(buffer));
console.log('PDF saved as output.pdf.');
