// Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-walmart.mjs

const query = `mutation ScrapeWalmart {
  goto(url: "https://www.walmart.com/search?q=iphone", waitUntil: domContentLoaded) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  products: mapSelector(selector: "[data-item-id]") {
    name: mapSelector(selector: "[data-automation-id='product-title']") {
      innerText
    }
    price: mapSelector(selector: "[data-testid='unified-global-product-price-a11y-text']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='product-ratings']") {
      innerText
    }
    reviewCount: mapSelector(selector: "[data-testid='product-reviews']") {
      innerText
    }
    link: mapSelector(selector: "a[href*='/ip/']") {
      href: attribute(name: "href") {
        value
      }
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
  name: p.name?.[0]?.innerText ?? '',
  price: p.price?.[0]?.innerText ?? '',
  rating: p.rating?.[0]?.innerText ?? '',
  reviewCount: p.reviewCount?.[0]?.innerText ?? '',
  link: p.link?.[0]?.href?.value ?? '',
}));
console.log(JSON.stringify(products, null, 2));
