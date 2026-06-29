#!/usr/bin/env bash
# Fetches the fully rendered HTML of a page using the Browserless /content endpoint.
# The response is raw HTML printed to stdout.
#
# Run: bash content.sh

curl -X POST \
  "https://production-sfo.browserless.io/content?token=YOUR_API_TOKEN_HERE" \
  -H 'Cache-Control: no-cache' \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://scraping-sandbox.netlify.app/javascript-enabled" }'
