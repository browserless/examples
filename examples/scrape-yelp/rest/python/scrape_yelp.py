# Scrapes Yelp business listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_yelp.py

import requests

query = """
mutation ScrapeYelp {
  goto(url: "https://www.yelp.com/search?find_desc=pizza&find_loc=New+York%2C+NY", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "[data-testid=serp-ia-card]", timeout: 15000) {
    time
  }
  businesses: mapSelector(selector: "[data-testid=serp-ia-card]") {
    name: mapSelector(selector: "[class*=businessName] a") { innerText }
    rating: mapSelector(selector: "[aria-label*=star]") {
      ratingLabel: attribute(name: "aria-label") { value }
    }
    reviewCount: mapSelector(selector: "[data-traffic-crawl-id=SearchResultBizRating] span:last-child") { innerText }
    categories: mapSelector(selector: "[data-testid=services-actions-component] a[href*=find_desc]") { innerText }
    priceRange: mapSelector(selector: "[class*=icon--16-marker] + span + span:not([data-font-weight])") { innerText }
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
for biz in data['businesses']:
    name = biz['name'][0]['innerText']
    rating = biz['rating'][0]['ratingLabel']['value']
    reviews = biz['reviewCount'][0]['innerText']
    print(f'{name} | {rating} | {reviews}')
