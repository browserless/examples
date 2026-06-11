// Logs in, saves an authenticated browser profile via CDP, then reuses it in parallel sessions.
// The saved profile persists cookies and localStorage so future sessions start pre-authenticated.
//
// Install: npm install puppeteer-core
// Run:     node profile.mjs

import puppeteer from 'puppeteer-core';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const ORIGIN = 'https://production-sfo.browserless.io';

// Phase 1 – create a named profile session.
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

// Phase 2 – reuse the saved profile across parallel sessions.
const WS = `wss://production-sfo.browserless.io?token=${TOKEN}&profile=my-profile`;

// Each connect() call is a separate browser process — profiles let them all start authenticated.
const results = await Promise.all(
  Array.from({ length: 5 }, async (_, i) => {
    const b = await puppeteer.connect({ browserWSEndpoint: WS });
    try {
      const page = await b.newPage();
      await page.goto(`https://app.example.com/item/${i}`);
      return await page.title();
    } finally {
      await b.close();
    }
  })
);
console.log(results);
