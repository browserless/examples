# Retries a Browserless /screenshot request with exponential backoff on failure.
#
# Install: pip install requests
# Run:     python retry_backoff.py

import time
import requests

def with_retry(fn, retries=3, base_delay=0.5):
    for attempt in range(retries + 1):
        response = fn()
        if response.status_code == 429 or not response.ok:
            if attempt == retries:
                response.raise_for_status()
            time.sleep(base_delay * (2 ** attempt))
            continue
        return response

response = with_retry(lambda: requests.post(
    'https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN_HERE',
    headers={'Content-Type': 'application/json'},
    json={'url': 'https://scraping-sandbox.netlify.app/dashboard'},
))

with open('screenshot.png', 'wb') as f:
    f.write(response.content)
