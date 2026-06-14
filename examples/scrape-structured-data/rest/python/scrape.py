# Extracts structured data from a page using the Browserless /scrape endpoint.
#
# Install: pip install requests
# Run:     python scrape.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE',
    json={
        'url': 'https://example.com',
        'elements': [
            {'selector': 'h1'},
            {'selector': 'p'},
        ],
    },
)
data = response.json()['data']
print(data)
