# Connects to Browserless with solveCaptchas=true and waits for the
# Browserless.captchaAutoSolved CDP event before submitting the form.
#
# Reuse the existing page from the default context so Browserless CDP events
# (including captchaAutoSolved) are visible on this page object. Register the
# CDP listener before navigation so the event isn't missed if the CAPTCHA solves
# immediately after the page loads.
#
# Install: pip install playwright
# Run:     python captcha.py

import asyncio
from playwright.async_api import async_playwright

WS_ENDPOINT = (
    'wss://production-sfo.browserless.io/stealth'
    '?token=YOUR_API_TOKEN_HERE'
    '&proxy=residential&proxyCountry=us'
    '&solveCaptchas=true&timeout=300000'
)


async def main():
    async with async_playwright() as playwright:
        # connect_over_cdp gives a stable CDP session on the remote browser.
        browser = await playwright.chromium.connect_over_cdp(WS_ENDPOINT)
        try:
            # Reuse the existing page from the default context so Browserless CDP
            # events (including captchaAutoSolved) are visible on this page object.
            context = browser.contexts[0]
            page = context.pages[0]
            cdp = await page.context.new_cdp_session(page)

            # Register before navigation so the event isn't missed if the CAPTCHA
            # solves immediately after the page loads.
            captcha_solved: asyncio.Future = asyncio.get_event_loop().create_future()
            # Guard against set_result being called twice if the event fires more than once.
            cdp.on(
                'Browserless.captchaAutoSolved',
                lambda event: captcha_solved.set_result(event) if not captcha_solved.done() else None,
            )

            await page.goto(
                'https://www.google.com/recaptcha/api2/demo',
                wait_until='networkidle',
            )

            # Race against a timeout so the script doesn't hang on pages with no CAPTCHA.
            await asyncio.wait_for(captcha_solved, timeout=30)

            await page.click('#recaptcha-demo-submit')
            await page.wait_for_load_state('networkidle')
            print('Done. Final URL:', page.url)
        finally:
            # Always close to release the session even on error.
            await browser.close()


asyncio.run(main())
