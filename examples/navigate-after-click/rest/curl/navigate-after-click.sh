#!/usr/bin/env bash
# Clicks a link and waits for navigation to complete using BQL.
# Run: bash navigate-after-click.sh

curl -X POST \
  "https://production-sfo.browserless.io/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation NavigateAfterClick { goto(url: \"https://example.com\", waitUntil: networkIdle) { status } click(selector: \"a\", waitForNavigation: true) { time } title { title } currentURL { url } }",
    "variables": {},
    "operationName": "NavigateAfterClick"
  }'
