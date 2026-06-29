// Retries a Browserless BQL request with exponential backoff on failure.
//
// Run: node retry-backoff.mjs

const TOKEN = 'YOUR_API_TOKEN_HERE';
const BQL_URL = `https://production-sfo.browserless.io/bql?token=${TOKEN}`;

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

async function fetchWithRetry(url, options, retries = MAX_RETRIES, delay = BASE_DELAY_MS) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

const response = await fetchWithRetry(BQL_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `mutation {
      goto(url: "https://scraping-sandbox.netlify.app/dashboard", waitUntil: networkIdle) { status }
      title { title }
    }`,
    variables: {},
  }),
});

const { data } = await response.json();
console.log('Title:', data.title.title);
