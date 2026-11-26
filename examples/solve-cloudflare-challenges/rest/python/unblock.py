# Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
# proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
# harder to bypass from datacenter IPs.
#
# Install: pip install requests
# Run:     python unblock.py

import requests

response = requests.post(
    'https://production-sfo.browserless.io/unblock?token=YOUR_API_TOKEN_HERE&proxy=residential',
    json={
        'url': 'https://www.scrapingcourse.com/cloudflare-challenge',
        'content': True,
        'cookies': False,
        'screenshot': False,
        'browserWSEndpoint': False,
    },
)

data = response.json()
print(data['content'][:500])
