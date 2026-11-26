#!/usr/bin/env bash
# Retries a Browserless /screenshot request with exponential backoff on failure.
# Run: bash retry-backoff.sh

#!/bin/bash
MAX_RETRIES=3
DELAY=1
for i in $(seq 1 $MAX_RETRIES); do
  STATUS=$(curl -s -o response.png -w "%{http_code}" -X POST \
    "https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://scraping-sandbox.netlify.app/dashboard"}')
  if [ "$STATUS" = "200" ]; then
    echo "Success"
    exit 0
  fi
  echo "Attempt $i failed with status $STATUS, retrying in ${DELAY}s..."
  sleep $DELAY
  DELAY=$((DELAY * 2))
done
echo "Failed after $MAX_RETRIES attempts" && exit 1
