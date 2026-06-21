# Disconnects from a Browserless browser session and reconnects to the same session.
# Uses BQL over HTTP — no browser library required.
#
# Install: pip install requests
# Run:     python reconnect.py

import requests

TOKEN = 'YOUR_API_TOKEN_HERE'
BQL_URL = f'https://production-sfo.browserless.io/stealth/bql?token={TOKEN}'

start_query = """
mutation StartSession {
  goto(url: "https://example.com", waitUntil: domContentLoaded) {
    status
  }
  reconnect(timeout: 60000) {
    browserQLEndpoint
  }
}
"""

start_response = requests.post(
    BQL_URL,
    json={
        'query': start_query,
        'variables': {},
        'operationName': 'StartSession',
    },
)

data = start_response.json()['data']
reconnect_url = f"{data['reconnect']['browserQLEndpoint']}?token={TOKEN}"

continue_response = requests.post(
    reconnect_url,
    json={
        'query': 'mutation ContinueSession { html { html } }',
        'variables': {},
        'operationName': 'ContinueSession',
    },
)

result = continue_response.json()
print(result['data']['html']['html'][:200])
