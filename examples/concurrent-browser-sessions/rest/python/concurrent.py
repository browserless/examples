# Captures screenshots of multiple pages concurrently using the Browserless REST API.
# Uses ThreadPoolExecutor so requests run in parallel threads.
#
# Install: pip install requests
# Run:     python concurrent.py

import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

TOKEN = 'YOUR_API_TOKEN_HERE'
URLS = [
    'https://example.com/page/1',
    'https://example.com/page/2',
    'https://example.com/page/3',
    'https://example.com/page/4',
    'https://example.com/page/5',
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
