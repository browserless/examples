#!/usr/bin/env bash
# Extracts all <img> src URLs from a page via the Browserless /scrape endpoint,
# then downloads each image to an images/ directory.
#
# Requires: curl, jq

TOKEN="YOUR_API_TOKEN_HERE"

URLS=$(curl -s -X POST \
  "https://production-sfo.browserless.io/scrape?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "elements": [{ "selector": "img", "timeout": 5000 }]
  }' | jq -r '.data[0].results[].attributes[] | select(.name=="src") | .value')

mkdir -p images
i=0
while IFS= read -r url; do
  curl -sL "$url" --output "images/image-$i.jpg"
  echo "Saved images/image-$i.jpg"
  i=$((i + 1))
done <<< "$URLS"
