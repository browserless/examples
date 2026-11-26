# Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_amazon.py

import requests

query = """
mutation ScrapeAmazon {
  goto(url: "https://www.amazon.com/s?k=wireless+headphones", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-component-type=s-search-result]", timeout: 15000) {
    time
  }
  products: mapSelector(selector: "[data-component-type=s-search-result]") {
    asin: attribute(name: "data-asin") { value }
    title: mapSelector(selector: "h2 span") { innerText }
    price: mapSelector(selector: ".a-price .a-offscreen") { innerText }
    rating: mapSelector(selector: ".a-icon-alt") { innerText }
    reviewCount: mapSelector(selector: "[aria-label*=ratings]") { innerText }
    link: mapSelector(selector: "a:has(h2)") {
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
for product in data['products']:
    title = product['title'][0]['innerText']
    price = product['price'][0]['innerText'] if product['price'] else 'N/A'
    rating = product['rating'][0]['innerText'] if product['rating'] else 'N/A'
    print(f'{title} | {price} | {rating}')
