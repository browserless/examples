// Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
// proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
// harder to bypass from datacenter IPs.
//
// Requires Node.js 18+ for the native fetch API. No extra packages needed.
// Run: node unblock.mjs

const TOKEN = 'YOUR_API_TOKEN_HERE';

const response = await fetch(
  `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example-cloudflare-protected.com',
      content: true,
      cookies: false,
      screenshot: false,
      browserWSEndpoint: false,
    }),
  }
);

const { content } = await response.json();
console.log(content.slice(0, 500));
