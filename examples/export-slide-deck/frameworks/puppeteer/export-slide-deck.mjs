// Exports a Google Slides presentation as a PDF using Puppeteer.
//
// Install: npm install puppeteer-core
// Run:     node export-slide-deck.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const PRESENTATION_ID = 'YOUR_PRESENTATION_ID';

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();
  await page.goto(
    `https://docs.google.com/presentation/d/${PRESENTATION_ID}/pub?start=false&loop=false&delayms=3000`,
    { waitUntil: 'networkidle2' }
  );

  const pdf = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
  });

  import { writeFileSync } from 'fs';
  writeFileSync('slide-deck.pdf', pdf);
  console.log('Exported to slide-deck.pdf');
} finally {
  await browser.close();
}
