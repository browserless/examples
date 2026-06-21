# Creates a long-lived Browserless session, connects to set state, disconnects,
# then reconnects to verify the state persists.
#
# Install: pip install requests playwright
# Run:     python persist_session.py

import requests
from playwright.sync_api import sync_playwright

TOKEN = "YOUR_API_TOKEN_HERE"

# Step 1: Create a long-lived session
session_response = requests.post(
    f"https://production-sfo.browserless.io/session?token={TOKEN}",
    json={"ttl": 300000, "stealth": True, "headless": False},
)
session = session_response.json()
print("Session created:", session["id"])
print("Connect URL:", session["connect"])

# Step 2: Connect and set state via Playwright
with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(session["connect"])
    context = browser.contexts[0] if browser.contexts else browser.new_context()
    page = context.new_page()
    page.goto("https://automationexercise.com")

    page.evaluate("""() => {
        localStorage.setItem('shoppingCart', JSON.stringify({items: [{id: 1}]}));
    }""")

    browser.close()

    # Step 3: Reconnect and verify
    browser2 = p.chromium.connect_over_cdp(session["connect"])
    context2 = browser2.contexts[0] if browser2.contexts else browser2.new_context()
    page2 = context2.new_page()
    page2.goto("https://automationexercise.com")

    cart = page2.evaluate("() => localStorage.getItem('shoppingCart')")
    print("Cart persisted:", cart)

    browser2.close()

# Step 4: Stop the session
requests.delete(f"{session['stop']}&force=true")
print("Session stopped.")
