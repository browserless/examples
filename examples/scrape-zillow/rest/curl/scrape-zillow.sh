#!/usr/bin/env bash
# Scrapes Zillow property listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-zillow.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeZillow { goto(url: \"https://www.zillow.com/new-york-ny/\", waitUntil: networkIdle) { status } waitForTimeout(time: 3000) { time } listings: mapSelector(selector: \"[data-test='\''property-card'\'']\") { address: mapSelector(selector: \"[data-test='\''property-card-addr'\'']\") { innerText } price: mapSelector(selector: \"[data-test='\''property-card-price'\'']\") { innerText } details: mapSelector(selector: \".StyledPropertyCardHomeDetails\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeZillow"
  }'
