#!/usr/bin/env bash
# Captures screenshots of multiple pages in parallel using the Browserless REST API.
# Each curl call opens an independent browser session; `wait` blocks until all finish.

TOKEN="YOUR_API_TOKEN_HERE"
BASE_URL="https://production-sfo.browserless.io/screenshot?token=${TOKEN}"

curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/page/1","options":{"type":"png","fullPage":true}}' \
  --output page-1.png &

curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/page/2","options":{"type":"png","fullPage":true}}' \
  --output page-2.png &

curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/page/3","options":{"type":"png","fullPage":true}}' \
  --output page-3.png &

wait
echo "All screenshots saved"
