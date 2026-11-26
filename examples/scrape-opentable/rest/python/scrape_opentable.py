# Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_opentable.py

import requests

query = """
mutation ScrapeOpenTable {
  goto(url: "https://www.opentable.com/s?term=italian&covers=2", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-test=restaurant-card]:has(h6)", timeout: 15000) {
    time
  }
  restaurants: mapSelector(selector: "[data-test=restaurant-card]:has(h6)") {
    name: mapSelector(selector: "h6") { innerText }
    summary: mapSelector(selector: "[data-testid=search-list-card-content-container] > div:nth-child(2)") { innerText }
    cuisine: mapSelector(selector: "[aria-label^=Price] + span") { innerText }
    priceRange: mapSelector(selector: "[aria-label^=Price]") { innerText }
    bookingsToday: mapSelector(selector: "[data-testid=icSocialProof] + span") { innerText }
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
for r in data['restaurants']:
    name = r['name'][0]['innerText']
    # The summary line reads "4.8 (1,573) • $$ • Italian • <neighborhood>".
    rating = r['summary'][0]['innerText'].strip().split(' ')[0]
    cuisine = r['cuisine'][0]['innerText']
    price = r['priceRange'][0]['innerText']
    print(f'{name} | {rating} stars | {cuisine} | {price}')
