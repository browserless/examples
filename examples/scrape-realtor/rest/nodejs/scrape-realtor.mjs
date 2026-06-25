// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-realtor.mjs

const query = `mutation ScrapeRealtor {
  goto(url: "https://www.realtor.com/realestateandhomes-search/San-Francisco_CA", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "[data-testid=card-content]", timeout: 15000) {
    time
  }
  properties: mapSelector(selector: "[data-testid=card-content]") {
    price: mapSelector(selector: "[data-testid=card-price]") { innerText }
    address: mapSelector(selector: "[data-testid=card-address]") { innerText }
    beds: mapSelector(selector: "[data-testid=property-meta-beds] span") { innerText }
    baths: mapSelector(selector: "[data-testid=property-meta-baths] span") { innerText }
    sqft: mapSelector(selector: "[data-testid=property-meta-sqft] span") { innerText }
    status: mapSelector(selector: "[data-testid=card-description]") { innerText }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeRealtor' }),
  }
);

const { data } = await response.json();
const properties = data.properties.map((p) => ({
  price: p.price?.[0]?.innerText ?? '',
  address: p.address?.[0]?.innerText ?? '',
  beds: p.beds?.[0]?.innerText ?? '',
  baths: p.baths?.[0]?.innerText ?? '',
  sqft: p.sqft?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(properties, null, 2));
