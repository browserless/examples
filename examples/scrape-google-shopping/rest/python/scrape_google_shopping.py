# Scrapes Google Shopping results using BQL with stealth mode.
#
# Install: pip install requests
# Run:     python scrape_google_shopping.py

import requests

query = """
mutation ScrapeGoogleShopping {
  goto(url: "https://www.google.com/search?q=wireless+headphones&tbm=shop", waitUntil: networkIdle) {
    status
  }
  products: mapSelector(selector: ".sh-dgr__grid-result") {
    title: mapSelector(selector: "h3.tAxDx") {
      innerText
    }
    price: mapSelector(selector: ".a8Pemb") {
      innerText
    }
    store: mapSelector(selector: ".aULzUe") {
      innerText
    }
    rating: mapSelector(selector: ".Rsc7Yb") {
      innerText
    }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeGoogleShopping'},
)

data = response.json()['data']
for product in data['products']:
    title = product['title'][0]['innerText'] if product['title'] else ''
    price = product['price'][0]['innerText'] if product['price'] else ''
    store = product['store'][0]['innerText'] if product['store'] else ''
    rating = product['rating'][0]['innerText'] if product['rating'] else ''
    print(f'{title} — {price} — {store} — {rating}')
