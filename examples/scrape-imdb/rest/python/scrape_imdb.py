# Scrapes IMDb top movie ratings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_imdb.py

import requests

query = """
mutation ScrapeIMDb {
  goto(url: "https://www.imdb.com/chart/top/", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ".ipc-metadata-list-summary-item", timeout: 15000) {
    time
  }
  movies: mapSelector(selector: ".ipc-metadata-list-summary-item") {
    title: mapSelector(selector: ".ipc-title__text") { innerText }
    metadata: mapSelector(selector: ".cli-title-metadata span") { innerText }
    rating: mapSelector(selector: ".ipc-rating-star--imdb") {
      ratingLabel: attribute(name: "aria-label") { value }
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeIMDb'},
)

data = response.json()['data']
for movie in data['movies']:
    title = movie['title'][0]['innerText'] if movie['title'] else ''
    rating = movie['rating'][0]['ratingLabel']['value'] if movie['rating'] else ''
    meta = [s['innerText'] for s in movie.get('metadata', [])]
    print(f'{title} — {rating} — {", ".join(meta)}')
