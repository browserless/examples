#!/usr/bin/env bash
# Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-booking.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeBooking { goto(url: \"https://www.booking.com/searchresults.html?ss=New+York&checkin=2025-09-01&checkout=2025-09-07&group_adults=2\", waitUntil: networkIdle) { status } waitForTimeout(time: 3000) { time } hotels: mapSelector(selector: \"[data-testid='\''property-card'\'']\") { name: mapSelector(selector: \"[data-testid='\''title'\'']\") { innerText } price: mapSelector(selector: \"[data-testid='\''price-and-discounted-price'\'']\") { innerText } rating: mapSelector(selector: \"[data-testid='\''review-score'\'']\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeBooking"
  }'
