// Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-booking.mjs

// Booking.com only shows prices for future stays, so search 30 days from today.
const day = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
const url = `https://www.booking.com/searchresults.html?ss=New+York&checkin=${day(30)}&checkout=${day(31)}&group_adults=2`;

const query = `mutation ScrapeBooking($url: String!) {
  goto(url: $url, waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid='property-card']", timeout: 30000) {
    time
  }
  hotels: mapSelector(selector: "[data-testid='property-card']") {
    name: mapSelector(selector: "[data-testid='title']") {
      innerText
    }
    price: mapSelector(selector: "[data-testid='price-and-discounted-price']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='review-score'] [aria-hidden='true']") {
      innerText
    }
    location: mapSelector(selector: "[data-testid='address-link']") {
      innerText
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { url } }),
  }
);

const { data } = await response.json();
const hotels = data.hotels.map((hotel) => ({
  name: hotel.name?.[0]?.innerText ?? '',
  price: hotel.price?.[0]?.innerText ?? '',
  rating: hotel.rating?.[0]?.innerText ?? '',
  location: hotel.location?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(hotels, null, 2));
