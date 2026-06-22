// Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-booking.mjs

const query = `mutation ScrapeBooking {
  goto(
    url: "https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2"
    waitUntil: networkIdle
  ) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  hotels: mapSelector(selector: "[data-testid='property-card']") {
    name: mapSelector(selector: "[data-testid='title']") {
      innerText
    }
    price: mapSelector(selector: "[data-testid='price-and-discounted-price']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='review-score']") {
      innerText
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeBooking' }),
  }
);

const { data } = await response.json();
const hotels = data.hotels.map((h) => ({
  name: h.name?.[0]?.innerText ?? '',
  price: h.price?.[0]?.innerText ?? '',
  rating: h.rating?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(hotels, null, 2));
