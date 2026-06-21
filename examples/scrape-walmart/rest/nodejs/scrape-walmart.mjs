// Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-walmart.mjs

const query = `mutation ScrapeWalmart {
  goto(url: "https://www.walmart.com/search?q=coffee+maker", waitUntil: networkIdle) {
    status
  }
  waitForTimeout(time: 2000) {
    time
  }
  products: mapSelector(selector: "[data-item-id]") {
    title: mapSelector(selector: "[data-automation-id='product-title']") {
      innerText
    }
    price: mapSelector(selector: "[itemprop='price']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='product-ratings']") {
      innerText
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeWalmart' }),
  }
);

const { data } = await response.json();
const products = data.products.map((p) => ({
  title: p.title?.[0]?.innerText ?? '',
  price: p.price?.[0]?.innerText ?? '',
  rating: p.rating?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(products, null, 2));
