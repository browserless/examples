# Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_realtor.py

import requests

query = """
mutation ScrapeRealtor {
  goto(url: "https://www.realtor.com/realestateandhomes-search/San-Francisco_CA", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "[data-testid=card-content]", timeout: 15000) {
    time
  }
  properties: mapSelector(selector: "[data-testid=card-content]") {
    price: mapSelector(selector: "[data-testid=card-price]") { innerText }
    address: mapSelector(selector: "[data-testid=card-address]") { innerText }
    beds: mapSelector(selector: "[data-testid=property-meta-beds] span") { innerText }
    baths: mapSelector(selector: "[data-testid=property-meta-baths] span") { innerText }
    sqft: mapSelector(selector: "[data-testid=property-meta-sqft] span") { innerText }
    status: mapSelector(selector: "[data-testid=card-description]") { innerText }
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeRealtor'},
)

data = response.json()['data']
for prop in data['properties']:
    price = prop['price'][0]['innerText'] if prop['price'] else ''
    address = prop['address'][0]['innerText'] if prop['address'] else ''
    beds = prop['beds'][0]['innerText'] if prop['beds'] else ''
    print(f'{price} — {address} — {beds} bed')
