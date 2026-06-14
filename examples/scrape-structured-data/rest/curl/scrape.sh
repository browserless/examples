#!/usr/bin/env bash
# Extracts structured data from a page using the Browserless /scrape endpoint.
# The response is JSON with matched elements for each selector.
#
# Run: bash scrape.sh

curl -X POST \
  "https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "elements": [
      { "selector": "h1" },
      { "selector": "p" }
    ]
  }'
