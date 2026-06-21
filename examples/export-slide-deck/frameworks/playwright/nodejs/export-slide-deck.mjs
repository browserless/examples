// Exports a Google Slides presentation as a PDF using Playwright.
//
// Install: npm install playwright-core
// Run:     node export-slide-deck.mjs

import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const PRESENTATION_ID = 'YOUR_PRESENTATION_ID';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();
  await page.goto(
    `https://docs.google.com/presentation/d/${PRESENTATION_ID}/pub?start=false&loop=false&delayms=3000`,
    { waitUntil: 'networkidle' }
  );

  const pdf = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
  });

  writeFileSync('slide-deck.pdf', pdf);
  console.log('Exported to slide-deck.pdf');
} finally {
  await browser.close();
}
