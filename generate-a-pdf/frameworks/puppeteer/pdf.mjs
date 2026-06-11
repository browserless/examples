// Generates a PDF from a live browser session via Puppeteer.
// Use this approach when you need to interact with the page before capturing.
//
// Install: npm install puppeteer-core
// Run:     node pdf.mjs

import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE',
});
try {
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
  });
  await fs.writeFile('output.pdf', pdf);
  console.log('PDF saved as output.pdf.');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
