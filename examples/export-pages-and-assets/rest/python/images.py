# Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
# using the Browserless /export endpoint.
#
# Install: pip install requests
# Run:     python images.py

import requests

TOKEN = 'YOUR_API_TOKEN_HERE'

response = requests.post(
    f'https://production-sfo.browserless.io/export?token={TOKEN}',
    json={'url': 'https://scraping-sandbox.netlify.app/harvest-direct', 'includeResources': True},
)

with open('page.zip', 'wb') as f:
    f.write(response.content)

print('Saved page.zip')
