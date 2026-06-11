# Two approaches for accessing Cloudflare Access-protected pages with Playwright:
#   1. Service Token — inject CF-Access headers via extra_http_headers on the context.
#   2. Saved profile — reuse a browser session captured after logging in through CF Access.
#
# Install: pip install playwright
# Run:     python cf-access.py

from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'

# Approach 1: inject Service Token headers.
with sync_playwright() as playwright:
    WS_ENDPOINT = f'wss://production-sfo.browserless.io/chromium/playwright?token={TOKEN}'
    browser = playwright.chromium.connect(WS_ENDPOINT)
    try:
        context = browser.new_context(
            extra_http_headers={
                'CF-Access-Client-Id': 'YOUR_CF_CLIENT_ID.access',
                'CF-Access-Client-Secret': 'YOUR_CF_CLIENT_SECRET',
            }
        )
        page = context.new_page()
        page.goto('https://internal.example.com/dashboard')
        print('Title:', page.title())
    finally:
        # Always close to release the session even on error.
        browser.close()

# Approach 2: reuse a saved authenticated profile.
# connect_over_cdp preserves the saved profile's context and cookies.
with sync_playwright() as playwright:
    WS_ENDPOINT = f'wss://production-sfo.browserless.io?token={TOKEN}&profile=cf-access-profile'
    browser = playwright.chromium.connect_over_cdp(WS_ENDPOINT)
    try:
        context = browser.contexts[0]
        page = context.pages[0]
        page.goto('https://internal.example.com/dashboard')
        print('Title:', page.title())
    finally:
        # Always close to release the session even on error.
        browser.close()
