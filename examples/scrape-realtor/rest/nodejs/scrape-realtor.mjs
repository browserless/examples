// Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-realtor.mjs

const query = `mutation ScrapeRealtor {
  goto(url: "https://www.realtor.com/realestateandhomes-search/San-Francisco_CA", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid=property-card]", timeout: 15000) {
    time
  }
  properties: mapSelector(selector: "[data-testid=property-card]") {
    price: mapSelector(selector: ".fs_700") { innerText }
    address: mapSelector(selector: "a .sr_true") { innerText }
    beds: mapSelector(selector: "[data-testid=property-meta-beds] [data-testid=meta-value]") { innerText }
    baths: mapSelector(selector: "[data-testid=property-meta-baths] [data-testid=meta-value]") { innerText }
    sqft: mapSelector(selector: "[data-testid=property-meta-sqft] [data-testid=meta-value]") { innerText }
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
console.log(JSON.stringify(data.properties, null, 2));
