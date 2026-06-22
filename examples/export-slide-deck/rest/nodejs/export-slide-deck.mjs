// Exports a Google Slides presentation as a PDF using Browserless.
//
// Run: node export-slide-deck.mjs

import { writeFileSync } from 'fs';

const PRESENTATION_ID = 'YOUR_PRESENTATION_ID';
const TOKEN = 'YOUR_API_TOKEN_HERE';

const response = await fetch(
  `https://production-sfo.browserless.io/pdf?token=${TOKEN}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `https://docs.google.com/presentation/d/${PRESENTATION_ID}/export/pdf`,
      options: {
        printBackground: true,
        format: 'A4',
        landscape: true,
      },
    }),
  }
);

const buffer = await response.arrayBuffer();
writeFileSync('slide-deck.pdf', Buffer.from(buffer));
console.log('Exported to slide-deck.pdf');
