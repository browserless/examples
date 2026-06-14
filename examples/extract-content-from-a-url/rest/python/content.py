# Fetches the fully rendered HTML of a page using the Browserless /content endpoint.
#
# Install: pip install requests
# Run:     python content.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/content?token=YOUR_API_TOKEN_HERE',
    headers={'Cache-Control': 'no-cache', 'Content-Type': 'application/json'},
    json={'url': 'https://example.com'},
)
html = response.text
print(html[:500])
