# Bypasses Cloudflare challenges via /unblock, then connects Playwright to the
# already-unblocked session using the returned browserWSEndpoint.
# The ttl parameter keeps the browser alive long enough for the client to connect.
#
# Install: pip install requests playwright
# Run:     python unblock.py

import requests
from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'

res = requests.post(
    f'https://production-sfo.browserless.io/unblock?token={TOKEN}&proxy=residential',
    json={
        'url': 'https://example-cloudflare-protected.com',
        'browserWSEndpoint': True,
        'ttl': 30000,
    },
)

# The /unblock response returns a raw WebSocket URL — append the token before connecting.
ws_endpoint = res.json()['browserWSEndpoint']

with sync_playwright() as p:
    # connect_over_cdp exposes the pre-existing browser context with the already-unblocked page.
    browser = p.chromium.connect_over_cdp(f"{ws_endpoint}?token={TOKEN}")
    try:
        context = browser.contexts[0]
        page = context.pages[0]
        print('Title:', page.title())
        print('URL:', page.url)
    finally:
        # Always close to release the session even on error.
        browser.close()
