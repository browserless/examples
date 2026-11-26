// Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-amazon.mjs

const query = `mutation ScrapeAmazon {
  goto(url: "https://www.amazon.com/s?k=wireless+headphones", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-component-type=s-search-result]", timeout: 15000) {
    time
  }
  products: mapSelector(selector: "[data-component-type=s-search-result]") {
    asin: attribute(name: "data-asin") { value }
    title: mapSelector(selector: "h2 span") { innerText }
    price: mapSelector(selector: ".a-price .a-offscreen") { innerText }
    rating: mapSelector(selector: ".a-icon-alt") { innerText }
    reviewCount: mapSelector(selector: "[aria-label*=ratings]") { innerText }
    link: mapSelector(selector: "a:has(h2)") {
      href: attribute(name: "href") { value }
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {} }),
  }
);

const { data } = await response.json();
console.log(JSON.stringify(data.products, null, 2));
