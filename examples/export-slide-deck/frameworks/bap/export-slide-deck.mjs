// Exports a web-based slide deck to PDF with BAP, one slide per page.
// width/height take CSS strings, sized here to a 16:9 slide.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node export-slide-deck.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://example.com/my-presentation', { waitUntil: 'networkIdle' });

  await page.pdf({
    path: 'deck.pdf',
    printBackground: true,
    width: '1280px',
    height: '720px',
  });
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
