#!/usr/bin/env bash
# Navigates to a reCAPTCHA page and solves it using a BQL mutation.
# The solve mutation auto-detects and solves any CAPTCHA on the current page.

TOKEN="YOUR_API_TOKEN_HERE"

curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SolveCaptcha { goto(url: \"https://www.google.com/recaptcha/api2/demo\") { status } solve { found solved time token } submit: click(selector: \"#recaptcha-demo-submit\") { time } }"
  }'
