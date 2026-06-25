// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-ticketmaster.mjs

const query = `mutation ScrapeTicketmaster {
  goto(url: "https://www.ticketmaster.com/search?q=concerts", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "[data-testid=search-event-card]", timeout: 15000) {
    time
  }
  events: mapSelector(selector: "[data-testid=search-event-card]") {
    name: mapSelector(selector: "[data-testid=event-name]") { innerText }
    date: mapSelector(selector: "[data-testid=event-date]") { innerText }
    venue: mapSelector(selector: "[data-testid=event-venue]") { innerText }
    price: mapSelector(selector: "[data-testid=event-price]") { innerText }
    link: mapSelector(selector: "a") {
      href: attribute(name: "href") { value }
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeTicketmaster' }),
  }
);

const { data } = await response.json();
const events = data.events.map((e) => ({
  name: e.name?.[0]?.innerText ?? '',
  date: e.date?.[0]?.innerText ?? '',
  venue: e.venue?.[0]?.innerText ?? '',
  price: e.price?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(events, null, 2));
