// Scrapes Zillow property listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-zillow.mjs

const query = `mutation ScrapeZillow {
  goto(url: "https://www.zillow.com/new-york-ny/", waitUntil: networkIdle) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  listings: mapSelector(selector: "[data-test='property-card']") {
    address: mapSelector(selector: "[data-test='property-card-addr']") {
      innerText
    }
    price: mapSelector(selector: "[data-test='property-card-price']") {
      innerText
    }
    details: mapSelector(selector: ".StyledPropertyCardHomeDetails") {
      innerText
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeZillow' }),
  }
);

const { data } = await response.json();
const listings = data.listings.map((l) => ({
  address: l.address?.[0]?.innerText ?? '',
  price: l.price?.[0]?.innerText ?? '',
  details: l.details?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(listings, null, 2));
