#!/usr/bin/env bash
# Routes browser traffic through a residential proxy and checks the resulting IP.
# Run: bash proxy.sh

curl -X POST \
  "https://production-sfo.browserless.io/scrape?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.ipify.org?format=json",
    "elements": [{ "selector": "body" }]
  }'
