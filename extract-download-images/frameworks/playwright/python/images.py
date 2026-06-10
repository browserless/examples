# Extracts all <img> src URLs from the fully rendered DOM, then downloads each
# image to an images/ directory. Useful when images are lazy-loaded or injected
# by JavaScript after initial page load.
#
# Install: pip install requests playwright && playwright install chromium
# Run:     python images.py

import os
import requests
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = f'wss://production-sfo.browserless.io/chromium/playwright?token={TOKEN}'

with sync_playwright() as playwright:
    browser = playwright.chromium.connect(WS_ENDPOINT)
    try:
        context = browser.new_context()
        page = context.new_page()
        page.goto('https://example.com')
        page.wait_for_load_state('networkidle')

        image_urls = page.evaluate("""() =>
            Array.from(document.querySelectorAll('img'))
              .map(img => img.src)
              .filter(src => src.startsWith('http'))
        """)

        print(f'Found {len(image_urls)} images')
        os.makedirs('images', exist_ok=True)

        for i, url in enumerate(image_urls):
            res = requests.get(url)
            ext = os.path.splitext(urlparse(url).path)[1] or '.jpg'
            filename = f'images/image-{i}{ext}'
            with open(filename, 'wb') as f:
                f.write(res.content)
            print(f'Saved {filename}')
    finally:
        # Always close to release the session even on error.
        browser.close()
