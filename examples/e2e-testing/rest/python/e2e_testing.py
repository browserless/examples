# Runs an end-to-end test against a remote Browserless browser using BQL.
#
# Install: pip install requests
# Run:     python e2e_testing.py

import requests

query = """
mutation E2ETest {
  goto(url: "https://automationexercise.com", waitUntil: networkIdle) {
    status
  }
  title {
    title
  }
  verify: text(selector: "h2") {
    text
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'E2ETest'},
)

data = response.json()['data']

assert data['goto']['status'] == 200, f"Expected status 200, got {data['goto']['status']}"
assert 'Automation' in data['title']['title'], f"Title check failed: {data['title']['title']}"

print('All assertions passed.')
print('Page title:', data['title']['title'])
print('H2 text:', data['verify']['text'])
