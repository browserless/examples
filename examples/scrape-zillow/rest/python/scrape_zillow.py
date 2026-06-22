# Scrapes Zillow property listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_zillow.py

import requests

query = """
mutation ScrapeZillow {
  goto(url: "https://www.zillow.com/new-york-ny/", waitUntil: networkIdle) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  listings: mapSelector(selector: "[data-test='property-card']") {
    address: mapSelector(selector: "[data-test='property-card-addr']") {
      innerText
    }
    price: mapSelector(selector: "[data-test='property-card-price']") {
      innerText
    }
    details: mapSelector(selector: ".StyledPropertyCardHomeDetails") {
      innerText
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeZillow'},
)

data = response.json()['data']
for listing in data['listings']:
    address = listing['address'][0]['innerText'] if listing['address'] else ''
    price = listing['price'][0]['innerText'] if listing['price'] else ''
    details = listing['details'][0]['innerText'] if listing['details'] else ''
    print(f'{address} — {price}\n  {details}\n')
