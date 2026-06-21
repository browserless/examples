// Retries a Playwright session with exponential backoff.
// Only retries transient failures (connection/WebSocket errors) — logic errors are re-thrown immediately.
//
// Install: npm install playwright-core
// Run:     node retry-backoff.mjs

import { chromium } from 'playwright-core';

const TRANSIENT = ['ECONNREFUSED', 'WebSocket', 'Protocol error', 'Target closed', 'net::'];

async function withRetry(fn, { retries = 3, baseDelay = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isTransient = TRANSIENT.some(s => err.message?.includes(s));
      if (attempt === retries || !isTransient) throw err;
      const delay = baseDelay * 2 ** attempt;
      console.warn(`Attempt ${attempt + 1} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

const result = await withRetry(async () => {
  const browser = await chromium.connectOverCDP(
    'wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE'
  );
  try {
    const context = browser.contexts()[0] ?? await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://example.com');
    return await page.title();
  } finally {
    // Always close to release the session even on error.
    await browser.close();
  }
});

console.log(result);
