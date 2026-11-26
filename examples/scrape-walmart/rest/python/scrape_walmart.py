# Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_walmart.py

import requests

query = """
mutation ScrapeWalmart {
  goto(url: "https://www.walmart.com/search?q=iphone", waitUntil: domContentLoaded) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  products: mapSelector(selector: "[data-item-id]") {
    name: mapSelector(selector: "[data-automation-id='product-title']") {
      innerText
    }
    price: mapSelector(selector: "[data-testid='unified-global-product-price-a11y-text']") {
      innerText
    }
    rating: mapSelector(selector: "[data-testid='product-ratings']") {
      innerText
    }
    reviewCount: mapSelector(selector: "[data-testid='product-reviews']") {
      innerText
    }
    link: mapSelector(selector: "a[href*='/ip/']") {
      href: attribute(name: "href") {
        value
      }
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
    name = product['name'][0]['innerText'] if product['name'] else ''
    price = product['price'][0]['innerText'] if product['price'] else ''
    rating = product['rating'][0]['innerText'] if product['rating'] else ''
    print(f'{name} — {price} — {rating}')
