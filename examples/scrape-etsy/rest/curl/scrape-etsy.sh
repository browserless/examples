#!/usr/bin/env bash
# Scrapes Etsy product titles and prices from search results.
# Run: bash scrape-etsy.sh

curl -X POST \
  "https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.etsy.com/search?q=candles",
    "elements": [
      { "selector": ".v2-listing-card h3" },
      { "selector": ".v2-listing-card .currency-value" }
    ]
  }'
