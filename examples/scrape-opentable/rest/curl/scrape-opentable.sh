#!/usr/bin/env bash
# Scrapes OpenTable restaurant listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-opentable.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeOpenTable { goto(url: \"https://www.opentable.com/s?term=italian&covers=2\", waitUntil: networkIdle) { status } waitForSelector(selector: \"[data-test=restaurant-card]\", timeout: 15000) { time } restaurants: mapSelector(selector: \"[data-test=restaurant-card]\") { name: mapSelector(selector: \"h2\") { innerText } rating: mapSelector(selector: \"[data-test=rating-score]\") { innerText } cuisine: mapSelector(selector: \"[data-test=cuisine]\") { innerText } priceRange: mapSelector(selector: \"[data-test=price-range]\") { innerText } bookingsToday: mapSelector(selector: \"[data-test=bookings-today]\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeOpenTable"
  }'
