// Searches Google and extracts result headings using the Browserless /scrape endpoint.
// Uses Node.js 18+ native fetch — no extra packages needed.
// Note: Google may block or CAPTCHA this request — use BQL for more reliable results.
//
// Run: node search.mjs

const response = await fetch(
  'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://www.google.com/search?q=Browserless+headless+browser',
      elements: [{ selector: 'h3' }],
    }),
  }
);
const { data } = await response.json();
const titles = data[0].results.map((r) => r.text);
console.log(titles);
