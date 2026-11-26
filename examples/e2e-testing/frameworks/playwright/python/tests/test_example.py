# Playwright E2E tests running against a remote Browserless browser.
# Install: pip install pytest-playwright
# Run:     pytest

import re
from playwright.sync_api import expect

def test_page_has_correct_title(page):
    page.goto("https://scraping-sandbox.netlify.app/products")
    expect(page).to_have_title(re.compile(r"Product Catalog"))

def test_heading_is_visible(page):
    page.goto("https://scraping-sandbox.netlify.app/products")
    heading = page.locator("h1")
    expect(heading).to_be_visible()
    expect(heading).to_have_text("Product Catalog")

def test_page_has_link(page):
    page.goto("https://scraping-sandbox.netlify.app/products")
    expect(page.locator("a[href]").first).to_be_visible()

def test_page_loads_without_analytics(page):
    blocked = []

    def handle_route(route):
        blocked.append(route.request.url)
        route.abort()

    page.route("**/analytics/**", handle_route)
    page.goto("https://scraping-sandbox.netlify.app/products")
    expect(page).to_have_title(re.compile(r"Product Catalog"))
    print(f"Blocked {len(blocked)} analytics request(s)")
