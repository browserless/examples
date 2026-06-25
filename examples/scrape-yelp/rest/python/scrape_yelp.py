# Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_yelp.py

import requests

query = """
mutation ScrapeYelp {
  goto(url: "https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "[data-testid=serp-ia-card]", timeout: 15000) {
    time
  }
  businesses: mapSelector(selector: "[data-testid=serp-ia-card]") {
    name: mapSelector(selector: "a[class*=businessName] span") { innerText }
    rating: mapSelector(selector: "[aria-label*=star]") {
      ratingLabel: attribute(name: "aria-label") { value }
    }
    reviewCount: mapSelector(selector: "span[class*=reviewCount]") { innerText }
    categories: mapSelector(selector: "a[class*=categoryLink]") { innerText }
    priceRange: mapSelector(selector: "span[class*=priceRange]") { innerText }
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeYelp'},
)

data = response.json()['data']
for biz in data['businesses']:
    name = biz['name'][0]['innerText'] if biz['name'] else ''
    rating = biz['rating'][0]['ratingLabel']['value'] if biz['rating'] else ''
    review_count = biz['reviewCount'][0]['innerText'] if biz['reviewCount'] else ''
    print(f'{name} — {rating} — {review_count}')
