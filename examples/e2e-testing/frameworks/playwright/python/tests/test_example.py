# Playwright E2E tests running against a remote Browserless browser.
# Install: pip install pytest-playwright
# Run:     pytest

def test_homepage_loads(page):
    page.goto("https://automationexercise.com", wait_until="networkidle")
    assert "Automation" in page.title()


def test_products_page(page):
    page.goto("https://automationexercise.com/products", wait_until="networkidle")
    page.wait_for_selector(".features_items")
    products = page.query_selector_all(".product-image-wrapper")
    assert len(products) > 0, "No products found"


def test_add_to_cart(page):
    page.goto("https://automationexercise.com/products", wait_until="networkidle")
    page.hover(".product-image-wrapper:first-child")
    page.click(".product-image-wrapper:first-child .add-to-cart")
    page.wait_for_selector("#cartModal")
    assert page.is_visible("#cartModal"), "Cart modal not shown"
