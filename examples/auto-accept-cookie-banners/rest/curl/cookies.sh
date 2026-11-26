#!/usr/bin/env bash
# Dismisses a cookie consent banner with a BQL mutation, then captures a screenshot.
#
# if returns null (not an error) when the selector is absent, so the mutation
# completes safely on pages with no banner. For a zero-config alternative, send
# blockConsentModals: true in the JSON body of /screenshot or /pdf.
#
# Run: bash cookies.sh

curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation AcceptCookies { goto(url: \"https://www.onetrust.com/\", waitUntil: networkIdle) { status } if(selector: \"[id*=accept], [class*=accept], button[id*=cookie]\", visible: true) { acceptBtn: click(selector: \"[id*=accept], [class*=accept], button[id*=cookie]\") { time } bannerClosed: waitForTimeout(time: 1000) { time } } screenshot { base64 } }"
  }'
