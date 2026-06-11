// Logs in once and reuses that authenticated state across future sessions.
// Saves cookies and localStorage via CDP so future sessions start pre-authenticated.
//
// Install: npm install puppeteer-core
// Run:     node session.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const ORIGIN = 'https://production-sfo.browserless.io';

// Phase 1 – create a named profile session and log in.
const session = await fetch(`${ORIGIN}/profile?token=${TOKEN}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'my-profile' }),
}).then((r) => r.json());

const browser = await puppeteer.connect({ browserWSEndpoint: session.connect });
try {
  const page = await browser.newPage();
  await page.goto('https://app.example.com/login');
  await page.type('#email', 'user@example.com');
  await page.type('#password', process.env.PASSWORD);
  await page.click("button[type='submit']");
  await page.waitForNavigation();

  // CDP command must be sent after navigation completes so all cookies are written.
  const cdp = await page.createCDPSession();
  const result = await cdp.send('Browserless.saveProfile', { name: 'my-profile' });
  console.log(result);
  // { ok: true, profileId: '<id>', name: 'my-profile', cookieCount: 12, originCount: 1 }
} finally {
  await browser.close();
}

// Phase 2 – reuse the saved profile in a new session.
const browser2 = await puppeteer.connect({
  browserWSEndpoint:
    `wss://production-sfo.browserless.io?token=${TOKEN}&profile=my-profile`,
});
try {
  const page = await browser2.newPage();
  await page.goto('https://app.example.com/dashboard'); // already logged in
  console.log('Title:', await page.title());
} finally {
  await browser2.close();
}
