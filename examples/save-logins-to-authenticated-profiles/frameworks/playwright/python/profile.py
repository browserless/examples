# Logs in, saves an authenticated browser profile via CDP, then reuses it.
# connect_over_cdp is required for Browserless.saveProfile — connect() does not expose CDP sessions.
#
# Install: pip install requests playwright
# Run:     python profile.py

import os
import requests
from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
ORIGIN = 'https://production-sfo.browserless.io'

# Phase 1 – create a named profile session.
session = requests.post(
    f'{ORIGIN}/profile?token={TOKEN}',
    json={'name': 'my-profile'},
).json()

with sync_playwright() as playwright:
    # connect_over_cdp gives access to CDP sessions needed for Browserless.saveProfile.
    browser = playwright.chromium.connect_over_cdp(session['connect'])
    try:
        context = browser.contexts[0]
        page = context.new_page()
        page.goto('https://app.example.com/login')
        page.fill('#email', 'user@example.com')
        page.fill('#password', os.environ['PASSWORD'])
        page.click("button[type='submit']")
        page.wait_for_url('**/dashboard')

        # CDP command must be sent after navigation completes so all cookies are written.
        cdp = page.context.new_cdp_session(page)
        result = cdp.send('Browserless.saveProfile', {'name': 'my-profile'})
        print(result)
        # {'ok': True, 'profileId': '<id>', 'name': 'my-profile', 'cookieCount': 12, 'originCount': 1}
    finally:
        browser.close()

# Phase 2 – reuse the saved profile.
WS_REUSE = (
    'wss://production-sfo.browserless.io/chromium/playwright'
    f'?token={TOKEN}&profile=my-profile'
)
with sync_playwright() as playwright:
    browser = playwright.chromium.connect_over_cdp(WS_REUSE)
    try:
        context = browser.contexts[0]
        page = context.pages[0]
        page.goto('https://app.example.com/dashboard')  # already logged in
        print('Title:', page.title())
    finally:
        browser.close()
