// Automates an email OTP login flow using Puppeteer.
// Navigates to the login page, submits the email to trigger the OTP, waits for
// the OTP field to appear, then reads and enters the code.
//
// Substitute getOtpFromInbox() with your actual inbox API (Mailosaur, Mailslurp,
// Gmail API, IMAP, etc.). Poll after the OTP field appears — not before — to
// avoid reading a stale code from an earlier session.
//
// Install: npm install puppeteer-core
// Run:     node otp.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';

// Swap this stub with your actual inbox API.
async function getOtpFromInbox(email) {
  throw new Error('Implement getOtpFromInbox() with your email provider');
}

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://production-sfo.browserless.io?token=${TOKEN}`,
});

try {
  const page = await browser.newPage();

  // Submit the email to trigger the OTP — the form changes state before the OTP field appears.
  await page.goto('https://app.example.com/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'user@example.com');
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[name="otp"], input[autocomplete="one-time-code"]');

  // Poll the inbox after the OTP field appears, not before — the email may not be sent yet.
  const otp = await getOtpFromInbox('user@example.com');
  console.log('Got OTP:', otp);

  await page.type('input[name="otp"], input[autocomplete="one-time-code"]', otp);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Logged in. URL:', page.url());
} finally {
  // Always close to release the session even on error.
  await browser.close();
}
