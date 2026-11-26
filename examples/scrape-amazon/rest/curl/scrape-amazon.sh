#!/usr/bin/env bash
# Scrapes Amazon product listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-amazon.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeAmazon { goto(url: \"https://www.amazon.com/s?k=wireless+headphones\", waitUntil: domContentLoaded) { status } waitForSelector(selector: \"[data-component-type=s-search-result]\", timeout: 15000) { time } products: mapSelector(selector: \"[data-component-type=s-search-result]\") { asin: attribute(name: \"data-asin\") { value } title: mapSelector(selector: \"h2 span\") { innerText } price: mapSelector(selector: \".a-price .a-offscreen\") { innerText } rating: mapSelector(selector: \".a-icon-alt\") { innerText } reviewCount: mapSelector(selector: \"[aria-label*=ratings]\") { innerText } link: mapSelector(selector: \"a:has(h2)\") { href: attribute(name: \"href\") { value } } } }",
    "variables": {}
  }'
