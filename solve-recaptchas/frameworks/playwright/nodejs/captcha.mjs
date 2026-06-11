// Connects to Browserless with solveCaptchas=true and waits for the
// Browserless.captchaAutoSolved CDP event before submitting the form.
//
// Reuse the existing page from the default context so Browserless CDP events
// (including captchaAutoSolved) are visible on this page object. Register the
// CDP listener before navigation so the event isn't missed if the CAPTCHA solves
// immediately after the page loads.
//
// Install: npm install playwright-core
// Run:     node captcha.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io/stealth?token=${TOKEN}&proxy=residential&proxyCountry=us&solveCaptchas=true&timeout=300000`
);

try {
  // Reuse the existing page from the default context so Browserless CDP events
  // (including captchaAutoSolved) are visible on this page object.
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  const cdp = await page.context().newCDPSession(page);

  // Register before navigation so the event isn't missed if the CAPTCHA solves
  // immediately after the page loads.
  const captchaSolved = new Promise((resolve) =>
    cdp.on('Browserless.captchaAutoSolved', resolve)
  );

  await page.goto('https://www.google.com/recaptcha/api2/demo', {
    waitUntil: 'networkidle',
  });

  // Race against a timeout so the script doesn't hang on pages with no CAPTCHA.
  await Promise.race([
    captchaSolved,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('CAPTCHA timeout')), 30000)
    ),
  ]);

  await page.click('#recaptcha-demo-submit');
  await page.waitForLoadState('networkidle');
  console.log('Done. Final URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
