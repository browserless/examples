// Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-opentable.mjs

const query = `mutation ScrapeOpenTable {
  goto(url: "https://www.opentable.com/s?term=italian&covers=2", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "[data-test=restaurant-card]", timeout: 15000) {
    time
  }
  restaurants: mapSelector(selector: "[data-test=restaurant-card]") {
    name: mapSelector(selector: "h2") { innerText }
    rating: mapSelector(selector: "[data-test=rating-score]") { innerText }
    cuisine: mapSelector(selector: "[data-test=cuisine]") { innerText }
    priceRange: mapSelector(selector: "[data-test=price-range]") { innerText }
    bookingsToday: mapSelector(selector: "[data-test=bookings-today]") { innerText }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeOpenTable' }),
  }
);

const { data } = await response.json();
const restaurants = data.restaurants.map((r) => ({
  name: r.name?.[0]?.innerText ?? '',
  rating: r.rating?.[0]?.innerText ?? '',
  cuisine: r.cuisine?.[0]?.innerText ?? '',
  priceRange: r.priceRange?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(restaurants, null, 2));
