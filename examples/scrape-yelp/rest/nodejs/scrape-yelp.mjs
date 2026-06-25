// Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-yelp.mjs

const query = `mutation ScrapeYelp {
  goto(url: "https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "[data-testid=serp-ia-card]", timeout: 15000) {
    time
  }
  businesses: mapSelector(selector: "[data-testid=serp-ia-card]") {
    name: mapSelector(selector: "a[class*=businessName] span") { innerText }
    rating: mapSelector(selector: "[aria-label*=star]") {
      ratingLabel: attribute(name: "aria-label") { value }
    }
    reviewCount: mapSelector(selector: "span[class*=reviewCount]") { innerText }
    categories: mapSelector(selector: "a[class*=categoryLink]") { innerText }
    priceRange: mapSelector(selector: "span[class*=priceRange]") { innerText }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeYelp' }),
  }
);

const { data } = await response.json();
const businesses = data.businesses.map((b) => ({
  name: b.name?.[0]?.innerText ?? '',
  rating: b.rating?.[0]?.ratingLabel?.value ?? '',
  reviewCount: b.reviewCount?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(businesses, null, 2));
