#!/usr/bin/env bash
# Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-opentable.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeOpenTable { goto(url: \"https://www.opentable.com/s?term=italian&covers=2\", waitUntil: domContentLoaded) { status } waitForSelector(selector: \"[data-test=restaurant-card]:has(h6)\", timeout: 15000) { time } restaurants: mapSelector(selector: \"[data-test=restaurant-card]:has(h6)\") { name: mapSelector(selector: \"h6\") { innerText } summary: mapSelector(selector: \"[data-testid=search-list-card-content-container] > div:nth-child(2)\") { innerText } cuisine: mapSelector(selector: \"[aria-label^=Price] + span\") { innerText } priceRange: mapSelector(selector: \"[aria-label^=Price]\") { innerText } bookingsToday: mapSelector(selector: \"[data-testid=icSocialProof] + span\") { innerText } } }",
    "variables": {}
  }'
