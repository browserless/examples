// Automates an email OTP login flow using Playwright, reading the code from a
// testmail.app inbox. Same flow as otp.mjs, with getOtpFromInbox() implemented.
// Uses Node.js 18+ native fetch for the inbox API — no extra packages needed.
//
// Each run signs in with a fresh inbox address, so no older email can match. To use an
// existing test account, fix TAG and add timestamp_from to skip older emails.
//
// Install: npm install playwright-core
// Run:     TESTMAIL_API_KEY=your_api_key node otp-testmail.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = 'YOUR_NAMESPACE_HERE';
const TAG = `login${Date.now()}`;
const EMAIL = `${TESTMAIL_NAMESPACE}.${TAG}@inbox.testmail.app`;

// Tighten this to your email template — a bare 6-digit match can catch an order number.
const OTP_PATTERN = /\b(\d{6})\b/;

async function getOtpFromInbox(tag) {
  const params = new URLSearchParams({
    apikey: TESTMAIL_API_KEY,
    namespace: TESTMAIL_NAMESPACE,
    tag,
    livequery: 'true',
  });
  // livequery holds the request open until an email arrives — no polling needed.
  const response = await fetch(`https://api.testmail.app/api/json?${params}`);
  const { emails } = await response.json();
  return emails[0].text.match(OTP_PATTERN)[1];
}

const browser = await chromium.connectOverCDP(
  `wss://production-sfo.browserless.io?token=${TOKEN}`
);

try {
  // Use the default context — browser.newPage() creates a new context that
  // doesn't inherit proxy, profile, or launch settings.
  const context = browser.contexts()[0];
  const page = await context.newPage();

  // Submit the email to trigger the OTP — the form changes state before the OTP field appears.
  await page.goto('https://app.example.com/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', EMAIL);
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[name="otp"], input[autocomplete="one-time-code"]');

  // Poll the inbox after the OTP field appears, not before — the email may not be sent yet.
  const otp = await getOtpFromInbox(TAG);
  console.log('Got OTP:', otp);

  await page.fill('input[name="otp"], input[autocomplete="one-time-code"]', otp);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  console.log('Logged in. URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
