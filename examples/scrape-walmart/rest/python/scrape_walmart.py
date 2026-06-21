# Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_walmart.py

import requests

query = """
mutation ScrapeWalmart {
  goto(url: "https://www.walmart.com/search?q=coffee+maker", waitUntil: networkIdle) {
    status
  }
  waitForTimeout(time: 2000) {
    time
  }
  products: mapSelector(selector: "[data-item-id]") {
    title: mapSelector(selector: "[data-automation-id='product-title']") {
      innerText
    }
    price: mapSelector(selector: "[itemprop='price']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='product-ratings']") {
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeWalmart'},
)

data = response.json()['data']
for product in data['products']:
    title = product['title'][0]['innerText'] if product['title'] else ''
    price = product['price'][0]['innerText'] if product['price'] else ''
    rating = product['rating'][0]['innerText'] if product['rating'] else ''
    print(f'{title} — {price} — {rating}')
