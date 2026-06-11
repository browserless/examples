#!/usr/bin/env bash
# Automates a login flow using a BQL mutation over HTTP.
# Chains navigation, field detection, typing, CAPTCHA solving, and form submission
# in a single request — no persistent browser connection needed.

TOKEN="YOUR_API_TOKEN_HERE"

curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation AgentLogin { goto(url: \"https://app.example.com/login\") { status } waitForSelector(selector: \"input[type=email], input[name=email], #email\") { selector } typeEmail: type(selector: \"input[type=email], input[name=email], #email\", text: \"user@example.com\") { time } typePass: type(selector: \"input[type=password]\", text: \"YOUR_PASSWORD\") { time } solve { found solved } submit: click(selector: \"button[type=submit]\") { time } waitForNavigation { status } }"
  }'
