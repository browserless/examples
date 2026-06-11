#!/usr/bin/env bash
# Captures a webpage as a PNG using the Browserless /screenshot endpoint.
# The response is a raw PNG binary written to screenshot.png.
#
# Run: bash screenshot.sh

curl -X POST \
  "https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN_HERE" \
  -H 'Cache-Control: no-cache' \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": { "fullPage": true, "type": "png" }
  }' \
  --output screenshot.png
echo "Screenshot saved as screenshot.png."
