// Automates an email OTP login flow using Playwright, reading the code from
// Mailpit (https://github.com/axllent/mailpit), an open-source, self-hosted email
// catcher. Same flow as otp.mjs, with getOtpFromInbox() implemented.
// Point your app's SMTP at Mailpit (port 1025); this script reads its REST API (port 8025).
// Uses Node.js 18+ native fetch for the inbox API — no extra packages needed.
//
// Each run signs in with a fresh address, so no older email can match. To use an
// existing test account, change EMAIL and clear its old emails in Mailpit first.
// smtp4dev (https://github.com/rnwood/smtp4dev) works the same way through its REST API.
//
// Install: npm install playwright-core
// Mailpit: docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit
// Run:     node otp-mailpit.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const MAILPIT_URL = 'http://localhost:8025';
const EMAIL = `login${Date.now()}@example.com`;

// Tighten this to your email template — a bare 6-digit match can catch an order number.
const OTP_PATTERN = /\b(\d{6})\b/;

async function getOtpFromInbox(email) {
  const params = new URLSearchParams({ query: `to:"${email}"` });
  // Check once a second, up to 120 times — Mailpit can't hold a request open until mail arrives.
  for (let attempt = 0; attempt < 120; attempt++) {
    const searchResponse = await fetch(`${MAILPIT_URL}/api/v1/search?${params}`);
    const { messages } = await searchResponse.json();
    if (messages.length > 0) {
      // Results come back newest first, with only a snippet — fetch the full message.
      const messageResponse = await fetch(`${MAILPIT_URL}/api/v1/message/${messages[0].ID}`);
      const { Text } = await messageResponse.json();
      return Text.match(OTP_PATTERN)[1];
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`No email to ${email} after 120 attempts`);
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
  const otp = await getOtpFromInbox(EMAIL);
  console.log('Got OTP:', otp);

  await page.fill('input[name="otp"], input[autocomplete="one-time-code"]', otp);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  console.log('Logged in. URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
