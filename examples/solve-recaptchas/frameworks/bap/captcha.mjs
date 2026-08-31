// Solves a reCAPTCHA on a demo page with BAP, then submits the form.
// Browserless supports reCAPTCHA v2, v3, invisible, Cloudflare Turnstile,
// GeeTest, and more via the `type` option.
//
// Install: npm install @browserless.io/bap-ts
// Run:     node captcha.mjs

import Browserless from '@browserless.io/bap-ts';

const browser = Browserless.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium/bql',
  token: 'YOUR_API_TOKEN_HERE',
});

try {
  const page = await browser.newPage();
  await page.goto('https://www.google.com/recaptcha/api2/demo');

  const { found, solved, token } = await page.solve({ type: 'recaptcha' });
  console.log({ found, solved, token });

  await page.click('#recaptcha-demo-submit');
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
