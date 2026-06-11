// Saves an authenticated browser profile and reuses it across sessions.
// Phase 1 creates a named profile session (use Puppeteer/Playwright to log in via CDP).
// Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
//
// Run: node profile.mjs

import fs from 'fs/promises';

const TOKEN = 'YOUR_API_TOKEN_HERE';
const ORIGIN = 'https://production-sfo.browserless.io';

// Phase 1 – create a named profile session.
const session = await fetch(`${ORIGIN}/profile?token=${TOKEN}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'my-profile' }),
}).then((r) => r.json());

console.log('Connect URL:', session.connect);
// Connect a CDP client (Puppeteer or Playwright) to session.connect,
// complete the login, and call Browserless.saveProfile to persist the session.

// Phase 2 – reuse the saved profile.
const response = await fetch(
  `${ORIGIN}/screenshot?token=${TOKEN}&profile=my-profile`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://app.example.com/dashboard' }),
  }
);
const buffer = await response.arrayBuffer();
await fs.writeFile('dashboard.png', Buffer.from(buffer));
console.log('Screenshot saved to dashboard.png.');
