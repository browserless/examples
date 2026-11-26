#!/usr/bin/env bash
# Scrapes Walmart product listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-walmart.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeWalmart { goto(url: \"https://www.walmart.com/search?q=iphone\", waitUntil: domContentLoaded) { status } waitForTimeout(time: 3000) { time } products: mapSelector(selector: \"[data-item-id]\") { name: mapSelector(selector: \"[data-automation-id='\''product-title'\'']\") { innerText } price: mapSelector(selector: \"[data-testid='\''unified-global-product-price-a11y-text'\'']\") { innerText } rating: mapSelector(selector: \"[data-testid='\''product-ratings'\'']\") { innerText } reviewCount: mapSelector(selector: \"[data-testid='\''product-reviews'\'']\") { innerText } link: mapSelector(selector: \"a[href*='\''\/ip\/'\'']\") { href: attribute(name: \"href\") { value } } } }",
    "variables": {},
    "operationName": "ScrapeWalmart"
  }'
