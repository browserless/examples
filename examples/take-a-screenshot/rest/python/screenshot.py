# Captures a webpage as a PNG using the Browserless /screenshot endpoint.
#
# Install: pip install requests
# Run:     python screenshot.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN_HERE',
    headers={'Cache-Control': 'no-cache', 'Content-Type': 'application/json'},
    json={'url': 'https://scraping-sandbox.netlify.app/receipt', 'options': {'fullPage': True, 'type': 'png'}},
)
with open('screenshot.png', 'wb') as f:
    f.write(response.content)
print('Screenshot saved as screenshot.png.')
