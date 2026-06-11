#!/usr/bin/env bash
# Two approaches to dismiss cookie consent banners before capturing a page.
#
# Approach 1: blockConsentModals=true query parameter — zero config, covers most
# major consent platforms (OneTrust, CookieBot, GDPR tools).
#
# Approach 2: BQL mutation with custom selector logic — use when the built-in
# blocker doesn't handle a specific banner framework.

TOKEN="YOUR_API_TOKEN_HERE"

# Approach 1: built-in consent blocker via query parameter.
curl -X POST \
  "https://production-sfo.browserless.io/screenshot?token=${TOKEN}&blockConsentModals=true" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  --output page.png

# Approach 2: BQL mutation with custom selector logic.
# if returns null (not an error) when the selector is absent — safe on pages with no banner.
# visible: true prevents clicking off-screen banner elements that are in the DOM but not rendered.
curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation AcceptCookies { goto(url: \"https://example.com\", waitUntil: networkIdle) { status } if(selector: \"[id*=accept], [class*=accept], button[id*=cookie]\", visible: true) { acceptBtn: click(selector: \"[id*=accept], [class*=accept], button[id*=cookie]\") { time } } screenshot { base64 } }"
  }'
