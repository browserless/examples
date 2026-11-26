// Retries a Browserless /screenshot request with exponential backoff on failure.
//
// Run: node retry-backoff.mjs

async function withRetry(fn, { retries = 3, baseDelay = 500 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await fn();
      if (result.status === 429) {
        if (attempt === retries) throw new Error('Browserless over capacity after retries');
        const delay = baseDelay * 2 ** attempt;
        console.warn(`Attempt ${attempt + 1} failed: 429. Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      return result;
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = baseDelay * 2 ** attempt;
      console.warn(`Attempt ${attempt + 1} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

const response = await withRetry(() =>
  fetch('https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN_HERE', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://scraping-sandbox.netlify.app/dashboard' }),
  })
);
const buffer = await response.arrayBuffer();
