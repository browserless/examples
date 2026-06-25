# Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_opentable.py

import requests

query = """
mutation ScrapeOpenTable {
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
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeOpenTable'},
)

data = response.json()['data']
for rest in data['restaurants']:
    name = rest['name'][0]['innerText'] if rest['name'] else ''
    rating = rest['rating'][0]['innerText'] if rest['rating'] else ''
    cuisine = rest['cuisine'][0]['innerText'] if rest['cuisine'] else ''
    print(f'{name} — {rating} — {cuisine}')
