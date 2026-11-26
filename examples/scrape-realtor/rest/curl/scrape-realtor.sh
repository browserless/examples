#!/usr/bin/env bash
# Scrapes Realtor.com property listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-realtor.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeRealtor { goto(url: \"https://www.realtor.com/realestateandhomes-search/San-Francisco_CA\", waitUntil: domContentLoaded) { status } waitForSelector(selector: \"[data-testid=property-card]\", timeout: 15000) { time } properties: mapSelector(selector: \"[data-testid=property-card]\") { price: mapSelector(selector: \".fs_700\") { innerText } address: mapSelector(selector: \"a .sr_true\") { innerText } beds: mapSelector(selector: \"[data-testid=property-meta-beds] [data-testid=meta-value]\") { innerText } baths: mapSelector(selector: \"[data-testid=property-meta-baths] [data-testid=meta-value]\") { innerText } sqft: mapSelector(selector: \"[data-testid=property-meta-sqft] [data-testid=meta-value]\") { innerText } } }",
    "variables": {}
  }'
