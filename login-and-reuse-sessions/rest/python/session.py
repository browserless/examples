# Logs in once and reuses that authenticated state across future sessions.
# Phase 1 creates a named profile session (use Playwright to log in via CDP).
# Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
#
# Install: pip install playwright
# Run:     python session.py

from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = (
    f'wss://production-sfo.browserless.io/chromium/playwright'
    f'?token={TOKEN}&profile=my-profile'
)

# Reuse the saved profile — assumes Browserless.saveProfile was already called
# via a Puppeteer or Playwright CDP session (see the Frameworks tab).
with sync_playwright() as playwright:
    # connect_over_cdp with /chromium/playwright exposes the profile-loaded context.
    browser = playwright.chromium.connect_over_cdp(WS_ENDPOINT)
    try:
        context = browser.contexts[0]
        page = context.pages[0]
        page.goto('https://app.example.com/dashboard')  # already logged in
        print('Title:', page.title())
    finally:
        # Always close to release the session even on error.
        browser.close()
