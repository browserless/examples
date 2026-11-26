# Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_realtor.py

import requests

query = """
mutation ScrapeRealtor {
  goto(url: "https://www.realtor.com/realestateandhomes-search/San-Francisco_CA", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid=property-card]", timeout: 15000) {
    time
  }
  properties: mapSelector(selector: "[data-testid=property-card]") {
    price: mapSelector(selector: ".fs_700") { innerText }
    address: mapSelector(selector: "a .sr_true") { innerText }
    beds: mapSelector(selector: "[data-testid=property-meta-beds] [data-testid=meta-value]") { innerText }
    baths: mapSelector(selector: "[data-testid=property-meta-baths] [data-testid=meta-value]") { innerText }
    sqft: mapSelector(selector: "[data-testid=property-meta-sqft] [data-testid=meta-value]") { innerText }
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
for prop in data['properties']:
    price = prop['price'][0]['innerText']
    address = prop['address'][0]['innerText'].replace('property detail for ', '')
    beds = prop['beds'][0]['innerText'] if prop['beds'] else '?'
    baths = prop['baths'][0]['innerText'] if prop['baths'] else '?'
    sqft = prop['sqft'][0]['innerText'] if prop['sqft'] else '?'
    print(f'{address} | {price} | {beds}bd/{baths}ba | {sqft} sqft')
