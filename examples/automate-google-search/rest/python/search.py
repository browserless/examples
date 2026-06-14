# Searches Google and extracts result headings using the Browserless /scrape endpoint.
# Note: Google may block or CAPTCHA this request — use BQL for more reliable results.
#
# Install: pip install requests
# Run:     python search.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE',
    json={
        'url': 'https://www.google.com/search?q=Browserless+headless+browser',
        'elements': [{'selector': 'h3'}],
    },
)
data = response.json()['data']
titles = [item['text'] for item in data[0]['results']]
print(titles)
