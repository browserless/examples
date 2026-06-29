# Captures screenshots of multiple pages concurrently using the Browserless REST API.
# Uses ThreadPoolExecutor so requests run in parallel threads.
#
# Install: pip install requests
# Run:     python concurrent.py

import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

TOKEN = 'YOUR_API_TOKEN_HERE'
URLS = [
    'https://scraping-sandbox.netlify.app/products',
    'https://scraping-sandbox.netlify.app/contact-us',
    'https://scraping-sandbox.netlify.app/receipt',
    'https://scraping-sandbox.netlify.app/dashboard',
    'https://scraping-sandbox.netlify.app/helix',
]


def capture(i_url):
    i, url = i_url
    res = requests.post(
        f'https://production-sfo.browserless.io/screenshot?token={TOKEN}',
        json={'url': url, 'options': {'type': 'png', 'fullPage': True}},
    )
    filename = f'screenshot-{i + 1}.png'
    with open(filename, 'wb') as f:
        f.write(res.content)
    print(f'Saved {filename}')


with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(capture, (i, url)) for i, url in enumerate(URLS)]
    for f in as_completed(futures):
        f.result()

print('All done')
