// Retries a BAP session with exponential backoff.
// Only ConnectionError is worth reconnecting for — a TimeoutError or a BQL
// error will usually fail the same way again, so those are re-thrown immediately.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node retry-backoff.mjs

import Browserless, { ConnectionError } from '@browserless.io/bap-ts';

async function withRetry(fn, { retries = 3, baseDelay = 1000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries || !(err instanceof ConnectionError)) throw err;
      const delay = baseDelay * 2 ** attempt;
      console.warn(`Attempt ${attempt + 1} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

const heading = await withRetry(async () => {
  const browser = Browserless.connect({
    browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
    token: 'YOUR_API_TOKEN_HERE',
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://scraping-sandbox.netlify.app/dashboard', { waitUntil: 'domContentLoaded' });
    return await page.$eval('h1');
  } finally {
    // Always close to release the session even on error.
    await browser.close();
  }
});

console.log(heading);
