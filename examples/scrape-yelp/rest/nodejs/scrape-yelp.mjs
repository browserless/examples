// Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-yelp.mjs

const query = `mutation ScrapeYelp {
  goto(url: "https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid=serp-ia-card]", timeout: 15000) {
    time
  }
  businesses: mapSelector(selector: "[data-testid=serp-ia-card]") {
    name: mapSelector(selector: "[class*=businessName] a") { innerText }
    rating: mapSelector(selector: "[aria-label*=star]") {
      ratingLabel: attribute(name: "aria-label") { value }
    }
    reviewCount: mapSelector(selector: "[data-traffic-crawl-id=SearchResultBizRating] span:last-child") { innerText }
    categories: mapSelector(selector: "[data-testid=services-actions-component] a[href*=find_desc]") { innerText }
    priceRange: mapSelector(selector: "[class*=icon--16-marker] + span + span:not([data-font-weight])") { innerText }
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
console.log(JSON.stringify(data.businesses, null, 2));
