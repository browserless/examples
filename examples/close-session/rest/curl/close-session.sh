#!/usr/bin/env bash
# Creates a Browserless session and immediately closes it.
# Run: bash close-session.sh

TOKEN="YOUR_API_TOKEN_HERE"

# Step 1: Create a session
SESSION=$(curl -s -X POST \
  "https://production-sfo.browserless.io/session?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"ttl": 60000, "stealth": true}')

echo "Session created: $SESSION"

# Step 2: Extract the stop URL and close the session
STOP_URL=$(echo "$SESSION" | python3 -c "import sys,json; print(json.load(sys.stdin)['stop'])")
curl -X DELETE "${STOP_URL}&force=true"
echo "Session closed."
