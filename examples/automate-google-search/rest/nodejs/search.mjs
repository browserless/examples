// Searches Google and extracts result headings with a BQL mutation on the /stealth/bql endpoint.
// Uses Node.js 18+ native fetch — no extra packages needed.
// Stealth mode helps, but Google can still answer with a block or CAPTCHA page.
//
// Run: node search.mjs

const query = `
  mutation GoogleSearch {
    goto(url: "https://www.google.com/search?q=Browserless+headless+browser") {
      status
    }
    results: mapSelector(selector: "h3", wait: true) {
      innerText
    }
  }
`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {} }),
  }
);

const result = await response.json();
console.log(result.data.results);
