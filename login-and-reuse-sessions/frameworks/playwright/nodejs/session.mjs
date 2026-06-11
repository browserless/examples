// Logs in once and reuses that authenticated state across future sessions.
// connectOverCDP is required for Browserless.saveProfile — connect() does not expose CDP sessions.
//
// Install: npm install playwright-core
// Run:     node session.mjs

import { chromium } from 'playwright-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const ORIGIN = 'https://production-sfo.browserless.io';

// Phase 1 – create a named profile session and log in.
const session = await fetch(`${ORIGIN}/profile?token=${TOKEN}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'my-profile' }),
}).then((r) => r.json());

const browser = await chromium.connectOverCDP(session.connect);
try {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto('https://app.example.com/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', process.env.PASSWORD);
  await page.click("button[type='submit']");
  await page.waitForURL('**/dashboard');

  // CDP command must be sent after navigation completes so all cookies are written.
  const cdpSession = await context.newCDPSession(page);
  const result = await cdpSession.send('Browserless.saveProfile', { name: 'my-profile' });
  console.log(result);
  // { ok: true, profileId: '<id>', name: 'my-profile', cookieCount: 12, originCount: 1 }
} finally {
  await browser.close();
}

// Phase 2 – reuse the saved profile.
const browser2 = await chromium.connect(
  `wss://production-sfo.browserless.io/chromium/playwright?token=${TOKEN}&profile=my-profile`
);
try {
  // connect() uses Playwright native mode — newPage() creates a page in the
  // profile-loaded default context without needing to access contexts() directly.
  const page = await browser2.newPage();
  await page.goto('https://app.example.com/dashboard'); // already logged in
  console.log('Title:', await page.title());
} finally {
  await browser2.close();
}
