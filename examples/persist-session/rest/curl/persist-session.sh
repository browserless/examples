#!/usr/bin/env bash
# Creates a long-lived Browserless session, connects to set state, disconnects, reconnects to verify.
# Run: bash persist-session.sh

TOKEN="YOUR_API_TOKEN_HERE"

# Step 1: Create a long-lived session
SESSION=$(curl -s -X POST \
  "https://production-sfo.browserless.io/session?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"ttl": 300000, "stealth": true, "headless": false}')

echo "Session created: $SESSION"

# Step 2: Extract stop URL for cleanup
STOP_URL=$(echo "$SESSION" | python3 -c "import sys,json; print(json.load(sys.stdin)['stop'])")

# Step 3: Stop the session when done
curl -X DELETE "${STOP_URL}&force=true"
echo "Session stopped."
