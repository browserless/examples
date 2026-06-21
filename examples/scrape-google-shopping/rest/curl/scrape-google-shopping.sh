#!/usr/bin/env bash
# Scrapes Google Shopping results using BQL with stealth mode.
# Run: bash scrape-google-shopping.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeGoogleShopping { goto(url: \"https://www.google.com/search?q=wireless+headphones&tbm=shop\", waitUntil: networkIdle) { status } products: mapSelector(selector: \".sh-dgr__grid-result\") { title: mapSelector(selector: \"h3.tAxDx\") { innerText } price: mapSelector(selector: \".a8Pemb\") { innerText } store: mapSelector(selector: \".aULzUe\") { innerText } rating: mapSelector(selector: \".Rsc7Yb\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeGoogleShopping"
  }'
