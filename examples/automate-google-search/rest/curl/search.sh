#!/usr/bin/env bash
# Searches Google and extracts result headings with a BQL mutation on the /stealth/bql endpoint.
# Stealth mode helps, but Google can still answer with a block or CAPTCHA page.
#
# Run: bash search.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation GoogleSearch { goto(url: \\\"https://www.google.com/search?q=Browserless+headless+browser\\\") { status } results: mapSelector(selector: \\\"h3\\\", wait: true) { innerText } }\", \"variables\": {}}"
