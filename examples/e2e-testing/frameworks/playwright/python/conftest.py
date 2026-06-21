# Pytest fixture for connecting Playwright to a remote Browserless browser.
# Install: pip install pytest-playwright
# Run:     pytest

import pytest
from playwright.sync_api import sync_playwright

TOKEN = "YOUR_API_TOKEN_HERE"
WS_ENDPOINT = f"wss://production-sfo.browserless.io/chromium/playwright?token={TOKEN}"


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.connect(WS_ENDPOINT)
        yield browser
        browser.close()


@pytest.fixture
def page(browser):
    context = browser.new_context()
    page = context.new_page()
    yield page
    context.close()
