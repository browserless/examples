// Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-amazon.mjs

const query = `mutation ScrapeAmazon {
  goto(url: "https://www.amazon.com/s?k=wireless+headphones", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "div.s-result-item[data-asin]", timeout: 15000) {
    time
  }
  products: mapSelector(selector: "div.s-result-item[data-asin]") {
    asin: attribute(name: "data-asin") { value }
    title: mapSelector(selector: "h2 span") { innerText }
    price: mapSelector(selector: ".a-price .a-offscreen") { innerText }
    rating: mapSelector(selector: ".a-icon-alt") { innerText }
    reviewCount: mapSelector(selector: ".a-size-base.s-underline-text") { innerText }
    link: mapSelector(selector: "h2 a") {
      href: attribute(name: "href") { value }
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeAmazon' }),
  }
);

const { data } = await response.json();
const products = data.products.map((p) => ({
  asin: p.asin?.value ?? '',
  title: p.title?.[0]?.innerText ?? '',
  price: p.price?.[0]?.innerText ?? '',
  rating: p.rating?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(products, null, 2));
