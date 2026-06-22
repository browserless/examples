# Retries a Browserless BQL request with exponential backoff on failure.
#
# Install: pip install requests
# Run:     python retry_backoff.py

import requests
import time

TOKEN = 'YOUR_API_TOKEN_HERE'
BQL_URL = f'https://production-sfo.browserless.io/bql?token={TOKEN}'

MAX_RETRIES = 5
BASE_DELAY = 1  # seconds

query = """
mutation {
  goto(url: "https://example.com", waitUntil: networkIdle) { status }
  title { title }
}
"""

delay = BASE_DELAY
for attempt in range(1, MAX_RETRIES + 1):
    try:
        response = requests.post(
            BQL_URL,
            json={'query': query, 'variables': {}},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()['data']
        print(f'Success on attempt {attempt}.')
        print('Title:', data['title']['title'])
        break
    except Exception as e:
        if attempt == MAX_RETRIES:
            raise
        print(f'Attempt {attempt} failed: {e}. Retrying in {delay}s...')
        time.sleep(delay)
        delay *= 2
