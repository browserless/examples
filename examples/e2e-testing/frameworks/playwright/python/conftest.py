# Pytest fixture for connecting Playwright to a remote Browserless browser.
# Install: pip install pytest-playwright
# Run:     pytest

import pytest
from playwright.sync_api import Playwright

@pytest.fixture(scope="session")
def browser(playwright: Playwright):
    browser = playwright.chromium.connect(
        "wss://production-sfo.browserless.io/chromium/playwright?token=YOUR_API_TOKEN_HERE"
    )
    yield browser
    browser.close()
