#!/usr/bin/env bash
# Scrapes Reddit posts from a subreddit using BQL with stealth mode.
# Run: bash scrape-reddit.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeReddit { goto(url: \"https://www.reddit.com/r/programming/\", waitUntil: networkIdle) { status } waitForTimeout(time: 2000) { time } posts: mapSelector(selector: \"article\") { title: mapSelector(selector: \"[id*='\''post-title'\'']\") { innerText } score: mapSelector(selector: \"[id*='\''vote-arrows'\'']\") { innerText } comments: mapSelector(selector: \"a[data-click-id='\''comments'\'']\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeReddit"
  }'
