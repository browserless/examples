# Scrapes GitHub trending repositories using BQL.
#
# Install: pip install requests
# Run:     python scrape_github_trending.py

import requests

query = """
mutation ScrapeGitHubTrending {
  goto(url: "https://github.com/trending", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "article.Box-row", timeout: 15000) {
    time
  }
  repos: mapSelector(selector: "article.Box-row") {
    name: mapSelector(selector: "h2 a") { innerText }
    description: mapSelector(selector: "p") { innerText }
    language: mapSelector(selector: "[itemprop=programmingLanguage]") { innerText }
    stars: mapSelector(selector: "a[href*=stargazers]") { innerText }
    forks: mapSelector(selector: "a[href*=forks]") { innerText }
    todayStars: mapSelector(selector: "span.d-inline-block.float-sm-right") { innerText }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeGitHubTrending'},
)

data = response.json()['data']
for repo in data['repos']:
    name = repo['name'][0]['innerText'].strip() if repo['name'] else ''
    desc = repo['description'][0]['innerText'] if repo.get('description') else ''
    lang = repo['language'][0]['innerText'] if repo.get('language') else ''
    stars = repo['stars'][0]['innerText'].strip() if repo.get('stars') else ''
    print(f'{name} — {lang} — {stars}')
