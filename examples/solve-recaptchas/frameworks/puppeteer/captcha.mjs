// Connects to Browserless with solveCaptchas=true and waits for the
// Browserless.captchaAutoSolved CDP event before submitting the form.
//
// Register the CDP listener before navigation so the event isn't missed if the
// CAPTCHA solves immediately after the page loads. Await the CDP event rather
// than a fixed timeout — it fires when Browserless finishes solving, not after
// an arbitrary number of seconds.
//
// Install: npm install puppeteer-core
// Run:     node captcha.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

const browser = await puppeteer.connect({
  browserWSEndpoint:
    `wss://production-sfo.browserless.io/stealth?token=${TOKEN}&proxy=residential&proxyCountry=us&solveCaptchas=true&timeout=300000`,
});

try {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();

  // Register before navigation so the event isn't missed if the CAPTCHA solves
  // immediately after the page loads.
  const captchaSolved = new Promise((resolve) =>
    cdp.on('Browserless.captchaAutoSolved', resolve)
  );

  await page.goto('https://www.google.com/recaptcha/api2/demo', {
    waitUntil: 'networkidle2',
  });

  // Race against a timeout so the script doesn't hang on pages with no CAPTCHA.
  await Promise.race([
    captchaSolved,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('CAPTCHA timeout')), 30000)
    ),
  ]);

  await page.click('#recaptcha-demo-submit');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Done. Final URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
