// Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-ticketmaster.mjs

const query = `mutation ScrapeTicketmaster {
  goto(url: "https://www.ticketmaster.com/search?q=concerts", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid=eventList] > li", timeout: 15000) {
    time
  }
  events: mapSelector(selector: "[data-testid=eventList] > li") {
    name: mapSelector(selector: "button[aria-controls=eventOverflow] + span") { innerText }
    date: mapSelector(selector: "li > div > div > span:first-child") { innerText }
    venue: mapSelector(selector: "button[aria-controls=eventOverflow] + span + span span:last-child") { innerText }
    link: mapSelector(selector: "[data-testid=event-list-link]") {
      href: attribute(name: "href") { value }
    }
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
console.log(JSON.stringify(data.events, null, 2));
