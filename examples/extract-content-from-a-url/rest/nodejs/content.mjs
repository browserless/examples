// Fetches the fully rendered HTML of a page using the Browserless /content endpoint.
// Uses Node.js 18+ native fetch — no extra packages needed.
//
// Run: node content.mjs

const response = await fetch(
  'https://production-sfo.browserless.io/content?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: 'https://scraping-sandbox.netlify.app/javascript-enabled' }),
  }
);
const html = await response.text();
console.log(html.slice(0, 500));
