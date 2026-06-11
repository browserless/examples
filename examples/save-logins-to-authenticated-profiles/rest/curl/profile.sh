#!/usr/bin/env bash
# Saves an authenticated browser profile and reuses it across sessions.
# Phase 1 creates a named profile session and prints the WebSocket URL for CDP login.
# Phase 2 reuses the saved profile to take a screenshot without re-authenticating.
#
# Run: bash profile.sh

TOKEN="YOUR_API_TOKEN_HERE"
ORIGIN="https://production-sfo.browserless.io"

# Phase 1 – create a named profile session.
SESSION=$(curl -s -X POST \
  "${ORIGIN}/profile?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-profile"}')
echo "Session: $SESSION"
# Connect a CDP client (Puppeteer or Playwright) to the 'connect' WebSocket URL,
# complete the login, and call Browserless.saveProfile to persist the session.

# Phase 2 – reuse the saved profile.
curl -X POST \
  "${ORIGIN}/screenshot?token=${TOKEN}&profile=my-profile" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://app.example.com/dashboard"}' \
  --output dashboard.png
echo "Screenshot saved to dashboard.png."
