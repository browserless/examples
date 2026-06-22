#!/usr/bin/env bash
# Disconnect and reconnect to a Browserless browser session using BQL over HTTP.
# Run: bash reconnect.sh

# Step 1: Start a session and get the reconnection endpoint
RESPONSE=$(curl -s -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation StartSession { goto(url: \"https://example.com\", waitUntil: domContentLoaded) { status } reconnect(timeout: 60000) { browserQLEndpoint browserWSEndpoint } }",
    "variables": {},
    "operationName": "StartSession"
  }')

echo "Session started:"
echo "$RESPONSE"

# Step 2: Extract the browserQLEndpoint from the response
RECONNECT_URL=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['reconnect']['browserQLEndpoint'])")

# Step 3: Reconnect using the returned endpoint
curl -X POST \
  "${RECONNECT_URL}?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ContinueSession { html { html } }",
    "variables": {},
    "operationName": "ContinueSession"
  }'
