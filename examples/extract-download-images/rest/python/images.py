# Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
# then downloads each image to an images/ directory.
#
# Install: pip install requests
# Run:     python images.py

import os
import requests
from urllib.parse import urlparse

TOKEN = 'YOUR_API_TOKEN_HERE'

scrape_res = requests.post(
    f'https://production-sfo.browserless.io/scrape?token={TOKEN}',
    json={
        'url': 'https://example.com',
        'elements': [{'selector': 'img', 'timeout': 5000}],
    },
)

data = scrape_res.json()['data']

# src is nested inside each result's attributes array.
image_urls = [
    attr['value']
    for result in data[0]['results']
    for attr in result['attributes']
    if attr['name'] == 'src' and attr['value'].startswith('http')
]

print(f'Found {len(image_urls)} images')
os.makedirs('images', exist_ok=True)

for i, url in enumerate(image_urls):
    res = requests.get(url)
    ext = os.path.splitext(urlparse(url).path)[1] or '.jpg'
    filename = f'images/image-{i}{ext}'
    with open(filename, 'wb') as f:
        f.write(res.content)
    print(f'Saved {filename}')
