#!/usr/bin/env bash
# Retries a Browserless BQL request with exponential backoff on failure.
# Run: bash retry-backoff.sh

TOKEN="YOUR_API_TOKEN_HERE"
URL="https://production-sfo.browserless.io/bql?token=${TOKEN}"
MAX_RETRIES=5
DELAY=1

for i in $(seq 1 $MAX_RETRIES); do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$URL" \
    -H "Content-Type: application/json" \
    -d '{"query": "mutation { goto(url: \"https://example.com\", waitUntil: networkIdle) { status } title { title } }", "variables": {}}')

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "Success on attempt $i:"
    echo "$BODY"
    exit 0
  fi

  echo "Attempt $i failed (HTTP $HTTP_CODE). Retrying in ${DELAY}s..."
  sleep $DELAY
  DELAY=$((DELAY * 2))
done

echo "All $MAX_RETRIES attempts failed."
exit 1
