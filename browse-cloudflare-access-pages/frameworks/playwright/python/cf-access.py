# Accesses a Cloudflare Access-protected page by injecting Service Token headers
# via extra_http_headers on a new context. Headers are sent on every request
# within that context.
#
# Install: pip install playwright
# Run:     python cf-access.py

from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = f'wss://production-sfo.browserless.io?token={TOKEN}'

with sync_playwright() as playwright:
    browser = playwright.chromium.connect_over_cdp(WS_ENDPOINT)
    try:
        context = browser.new_context(
            extra_http_headers={
                'CF-Access-Client-Id': 'YOUR_CF_CLIENT_ID.access',
                'CF-Access-Client-Secret': 'YOUR_CF_CLIENT_SECRET',
            }
        )
        page = context.new_page()
        page.goto('https://internal.example.com/dashboard', wait_until='networkidle')
        print('Title:', page.title())
        page.screenshot(path='dashboard.png')
    finally:
        # Always close to release the session even on error.
        browser.close()
