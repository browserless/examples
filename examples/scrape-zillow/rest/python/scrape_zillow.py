# Scrapes real estate agent names and profile URLs from a Zillow agent directory using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_zillow.py

import requests

query = """
mutation ScrapeZillow {
  goto(
    url: "https://www.zillow.com/professionals/real-estate-agent-reviews/new-york-ny/"
    waitUntil: networkIdle
  ) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  agents: mapSelector(selector: "a[href*='/profile/']") {
    name: mapSelector(selector: "h2") {
      innerText
    }
    profileUrl: attribute(name: "href") {
      value
    }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxySticky': 'true',
        'proxyCountry': 'us',
        'humanlike': 'true',
        'blockAds': 'true',
    },
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeZillow'},
)

data = response.json()['data']
for agent in data['agents']:
    name = agent['name'][0]['innerText'] if agent['name'] else ''
    profile_url = agent['profileUrl']['value'] if agent['profileUrl'] else ''
    print(f'{name}: {profile_url}')
