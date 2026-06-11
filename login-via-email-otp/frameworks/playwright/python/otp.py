# Automates an email OTP login flow using Playwright.
# Navigates to the login page, submits the email to trigger the OTP, waits for
# the OTP field to appear, then reads and enters the code.
#
# Substitute get_otp_from_inbox() with your actual inbox API (Mailosaur, Mailslurp,
# Gmail API, IMAP, etc.). Poll after the OTP field appears — not before — to
# avoid reading a stale code from an earlier session.
#
# Install: pip install playwright
# Run:     python otp.py

from playwright.sync_api import sync_playwright

TOKEN = 'YOUR_API_TOKEN_HERE'
WS_ENDPOINT = f'wss://production-sfo.browserless.io/chromium/playwright?token={TOKEN}'


def get_otp_from_inbox(email: str) -> str:
    # Swap this stub with your actual inbox API.
    raise NotImplementedError('Implement get_otp_from_inbox() with your email provider')


with sync_playwright() as playwright:
    browser = playwright.chromium.connect(WS_ENDPOINT)
    try:
        context = browser.new_context()
        page = context.new_page()

        # Submit the email to trigger the OTP — the form changes state before the OTP field appears.
        page.goto('https://app.example.com/login')
        page.fill('input[type="email"]', 'user@example.com')
        page.click('button[type="submit"]')
        page.wait_for_selector('input[name="otp"], input[autocomplete="one-time-code"]')

        # Poll the inbox after the OTP field appears, not before — the email may not be sent yet.
        otp = get_otp_from_inbox('user@example.com')
        print(f'Got OTP: {otp}')

        page.fill('input[name="otp"], input[autocomplete="one-time-code"]', otp)
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')
        print(f'Logged in. URL: {page.url}')
    finally:
        # Always close to release the session even on error.
        browser.close()
