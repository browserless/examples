#!/usr/bin/env bash
# Scrapes YouTube search results using BQL with stealth mode.
# Run: bash scrape-youtube.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeYouTube { goto(url: \"https://www.youtube.com/results?search_query=javascript+tutorial\", waitUntil: networkIdle) { status } waitForTimeout(time: 2000) { time } videos: mapSelector(selector: \"ytd-video-renderer\") { title: mapSelector(selector: \"#video-title\") { innerText } channel: mapSelector(selector: \"[id='\''channel-name'\'']\") { innerText } views: mapSelector(selector: \"span.inline-metadata-item\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeYouTube"
  }'
