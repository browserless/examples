#!/usr/bin/env bash
# Exports a Google Slides presentation as a PDF using Browserless.
# Run: bash export-slide-deck.sh

curl -X POST \
  "https://production-sfo.browserless.io/pdf?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.google.com/presentation/d/YOUR_PRESENTATION_ID/export/pdf",
    "options": {
      "printBackground": true,
      "format": "A4",
      "landscape": true
    }
  }' \
  --output slide-deck.pdf

echo "Exported to slide-deck.pdf"
