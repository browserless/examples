# Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_amazon.py

import requests

query = """
mutation ScrapeAmazon {
  goto(url: "https://www.amazon.com/s?k=wireless+headphones", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "div.s-result-item[data-asin]", timeout: 15000) {
    time
  }
  products: mapSelector(selector: "div.s-result-item[data-asin]") {
    asin: attribute(name: "data-asin") { value }
    title: mapSelector(selector: "h2 span") { innerText }
    price: mapSelector(selector: ".a-price .a-offscreen") { innerText }
    rating: mapSelector(selector: ".a-icon-alt") { innerText }
    reviewCount: mapSelector(selector: ".a-size-base.s-underline-text") { innerText }
    link: mapSelector(selector: "h2 a") {
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeAmazon'},
)

data = response.json()['data']
for prod in data['products']:
    title = prod['title'][0]['innerText'] if prod['title'] else ''
    price = prod['price'][0]['innerText'] if prod['price'] else ''
    rating = prod['rating'][0]['innerText'] if prod['rating'] else ''
    print(f'{title} — {price} — {rating}')
