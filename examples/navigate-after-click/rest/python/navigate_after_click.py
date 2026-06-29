# Clicks a link and waits for navigation to complete using BQL.
#
# Install: pip install requests
# Run:     python navigate_after_click.py

import requests

query = """
mutation NavigateAfterClick {
  goto(url: "https://scraping-sandbox.netlify.app/products", waitUntil: networkIdle) {
    status
  }
  click(selector: "a", waitForNavigation: true) {
    time
  }
  title {
    title
  }
  currentURL {
    url
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'NavigateAfterClick'},
)

data = response.json()['data']
print('Navigated to:', data['currentURL']['url'])
print('Page title:', data['title']['title'])
