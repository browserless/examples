# Records a browser session as a .webm file using Browserless CDP commands.
# Must reuse the existing context and page from connect_over_cdp — creating new ones
# starts a fresh session that isn't wired to the recording.
#
# Install: pip install playwright && playwright install chromium
# Run:     python record.py

import base64
import time
from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = f'wss://production-sfo.browserless.io?token={TOKEN}&headless=false&stealth&record=true'

with sync_playwright() as playwright:
    browser = playwright.chromium.connect_over_cdp(WS_ENDPOINT)
    try:
        # Reuse the existing context and page — new ones won't be wired to the recording.
        context = browser.contexts[0]
        page = context.pages[0]

        # Set viewport before starting — dimensions are fixed for the entire recording.
        page.set_viewport_size({'width': 1280, 'height': 720})

        cdp_session = context.new_cdp_session(page)
        cdp_session.send('Browserless.startRecording')

        page.goto('https://scraping-sandbox.netlify.app/login')
        time.sleep(5)

        page.goto('https://scraping-sandbox.netlify.app/contact-us')
        time.sleep(5)

        # base64 encoding is required — CDP can't transfer raw binary over its text protocol.
        response = cdp_session.send('Browserless.stopRecording', {'encoding': 'base64'})
        with open('recording.webm', 'wb') as f:
            f.write(base64.b64decode(response['value']))

        print('Recording saved to recording.webm')
    finally:
        browser.close()
