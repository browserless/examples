#!/usr/bin/env bash
# Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-walmart.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeWalmart { goto(url: \"https://www.walmart.com/search?q=coffee+maker\", waitUntil: networkIdle) { status } waitForTimeout(time: 2000) { time } products: mapSelector(selector: \"[data-item-id]\") { title: mapSelector(selector: \"[data-automation-id='\''product-title'\'']\") { innerText } price: mapSelector(selector: \"[itemprop='\''price'\'']\") { innerText } rating: mapSelector(selector: \"[data-testid='\''product-ratings'\'']\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeWalmart"
  }'
