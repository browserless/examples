# Scrapes Ticketmaster event listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_ticketmaster.py

import requests

query = """
mutation ScrapeTicketmaster {
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
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={'query': query, 'variables': {}},
)

data = response.json()['data']
for event in data['events']:
    name = event['name'][0]['innerText']
    date = event['date'][0]['innerText']
    venue = event['venue'][0]['innerText'] if event['venue'] else ''
    print(f'{name} | {date} | {venue}')
