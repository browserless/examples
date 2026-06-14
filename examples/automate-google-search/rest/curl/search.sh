#!/usr/bin/env bash
# Searches Google and extracts result headings using the Browserless /scrape endpoint.
# Note: Google may block or CAPTCHA this request — use BQL for more reliable results.
#
# Run: bash search.sh

curl -X POST \
  "https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com/search?q=Browserless+headless+browser",
    "elements": [{ "selector": "h3" }]
  }'
