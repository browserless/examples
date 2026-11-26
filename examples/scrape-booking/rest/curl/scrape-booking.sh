#!/usr/bin/env bash
# Scrapes Booking.com hotel listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-booking.sh

# macOS uses date -v, Linux uses date -d.
CHECKIN=$(date -v+30d +%F 2>/dev/null || date -d '+30 days' +%F)
CHECKOUT=$(date -v+31d +%F 2>/dev/null || date -d '+31 days' +%F)

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeBooking($url: String!) { goto(url: $url, waitUntil: domContentLoaded) { status } waitForSelector(selector: \"[data-testid='\''property-card'\'']\", timeout: 30000) { time } hotels: mapSelector(selector: \"[data-testid='\''property-card'\'']\") { name: mapSelector(selector: \"[data-testid='\''title'\'']\") { innerText } price: mapSelector(selector: \"[data-testid='\''price-and-discounted-price'\'']\") { innerText } rating: mapSelector(selector: \"[data-testid='\''review-score'\''] [aria-hidden='\''true'\'']\") { innerText } location: mapSelector(selector: \"[data-testid='\''address-link'\'']\") { innerText } } }",
    "variables": {
      "url": "https://www.booking.com/searchresults.html?ss=New+York&checkin='"$CHECKIN"'&checkout='"$CHECKOUT"'&group_adults=2"
    }
  }'
