# Exports a page's HTML and linked assets (CSS, JS, images) to a local directory
# by intercepting network responses as the page loads.
#
# Install: pip install playwright
# Run:     python images.py

import os
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = f'wss://production-sfo.browserless.io?token={TOKEN}'

assets = []

def handle_response(response):
    if response.request.resource_type in ('stylesheet', 'script', 'image', 'font'):
        try:
            assets.append({'url': response.url, 'buf': response.body()})
        except Exception:
            pass

with sync_playwright() as playwright:
    browser = playwright.chromium.connect_over_cdp(WS_ENDPOINT)
    try:
        context = browser.contexts[0]
        page = context.new_page()
        page.on('response', handle_response)
        page.goto('https://example.com')
        page.wait_for_load_state('networkidle')

        html = page.content()

        os.makedirs('page', exist_ok=True)
        with open('page/index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved page/index.html')

        for i, asset in enumerate(assets):
            ext = os.path.splitext(urlparse(asset['url']).path)[1]
            filename = f'page/asset-{i}{ext}'
            with open(filename, 'wb') as f:
                f.write(asset['buf'])
            print(f'Saved {filename}')
    finally:
        browser.close()
