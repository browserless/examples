// Scrapes Etsy product titles and prices from search results.
//
// Run: node scrape-etsy.mjs

const response = await fetch(
  'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://www.etsy.com/search?q=candles',
      elements: [
        { selector: '.v2-listing-card h3' },
        { selector: '.v2-listing-card .currency-value' },
      ],
    }),
  }
);

const { data } = await response.json();
const titles = data[0].results.map((r) => r.text);
const prices = data[1].results.map((r) => r.text);
console.log(titles.map((title, i) => ({ title, price: prices[i] })));
