#!/usr/bin/env bash
# Runs multiple DOM queries in a single BQL request — title, h1, meta description, and links.
# Run: bash batch-dom-queries.sh

curl -X POST \
  "https://production-sfo.browserless.io/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation BatchDOMQueries { goto(url: \"https://example.com\", waitUntil: networkIdle) { status } title { title } heading: text(selector: \"h1\") { text } description: attribute(selector: \"meta[name='\''description'\'']\", name: \"content\") { value } links: mapSelector(selector: \"a\") { text: innerText href: attribute(name: \"href\") { value } } }",
    "variables": {},
    "operationName": "BatchDOMQueries"
  }'
