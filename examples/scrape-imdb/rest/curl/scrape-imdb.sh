#!/usr/bin/env bash
# Scrapes IMDb top movie ratings using BQL with stealth mode and residential proxy.
# Run: bash scrape-imdb.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeIMDb { goto(url: \"https://www.imdb.com/chart/top/\", waitUntil: networkIdle) { status } waitForSelector(selector: \".ipc-metadata-list-summary-item\", timeout: 15000) { time } movies: mapSelector(selector: \".ipc-metadata-list-summary-item\") { title: mapSelector(selector: \".ipc-title__text\") { innerText } metadata: mapSelector(selector: \".cli-title-metadata span\") { innerText } rating: mapSelector(selector: \".ipc-rating-star--imdb\") { ratingLabel: attribute(name: \"aria-label\") { value } } } }",
    "variables": {},
    "operationName": "ScrapeIMDb"
  }'
