# Connects to Browserless by replacing chromium.launch() with connect_over_cdp().
# No local browser binaries needed — you're connecting to Browserless instead.
#
# Install: pip install playwright
# Run:     python script.py

from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = f'wss://production-sfo.browserless.io?token={TOKEN}'

with sync_playwright() as playwright:
    # Before — runs a local browser.
    # browser = playwright.chromium.launch()

    # After — runs on Browserless.
    browser = playwright.chromium.connect_over_cdp(WS_ENDPOINT)
    try:
        # Use the default context — new_context() doesn't inherit launch settings.
        context = browser.contexts[0]
        page = context.new_page()
        page.goto('https://example.com')
        print('Title:', page.title())
    finally:
        # Always close to release the session even on error.
        browser.close()
