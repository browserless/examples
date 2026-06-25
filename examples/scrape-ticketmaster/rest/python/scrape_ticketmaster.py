# Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_ticketmaster.py

import requests

query = """
mutation ScrapeTicketmaster {
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
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeTicketmaster'},
)

data = response.json()['data']
for event in data['events']:
    name = event['name'][0]['innerText'] if event['name'] else ''
    date = event['date'][0]['innerText'] if event['date'] else ''
    venue = event['venue'][0]['innerText'] if event['venue'] else ''
    price = event['price'][0]['innerText'] if event['price'] else ''
    print(f'{name} — {date} — {venue} — {price}')
