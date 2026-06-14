// Extracts structured data from a page using the Browserless /scrape endpoint.
// Uses Node.js 18+ native fetch — no extra packages needed.
//
// Run: node scrape.mjs

const response = await fetch(
  'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example.com',
      elements: [
        { selector: 'h1' },
        { selector: 'p' },
      ],
    }),
  }
);
const { data } = await response.json();
console.log(data);
