#!/usr/bin/env bash
# Generates a PDF from a URL using the Browserless /pdf endpoint.
# The response is a raw PDF binary written to output.pdf.
#
# Run: bash pdf.sh

curl -X POST \
  "https://production-sfo.browserless.io/pdf?token=YOUR_API_TOKEN_HERE" \
  -H 'Cache-Control: no-cache' \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://scraping-sandbox.netlify.app/dashboard-report",
    "options": {
      "displayHeaderFooter": true,
      "printBackground": true,
      "format": "A4"
    }
  }' \
  -o output.pdf
echo "PDF saved as output.pdf."
