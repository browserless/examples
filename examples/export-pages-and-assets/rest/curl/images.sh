#!/usr/bin/env bash
# Exports a page and all its linked resources (CSS, JS, images) as a ZIP file
# using the Browserless /export endpoint.

TOKEN="YOUR_API_TOKEN_HERE"

curl -X POST \
  "https://production-sfo.browserless.io/export?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://scraping-sandbox.netlify.app/harvest-direct","includeResources":true}' \
  --output page.zip

echo "Saved page.zip"
