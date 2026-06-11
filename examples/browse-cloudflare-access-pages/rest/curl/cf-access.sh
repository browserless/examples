#!/usr/bin/env bash
# Two approaches for accessing Cloudflare Access-protected pages via the REST API:
#   1. Saved profile — reuse a browser session captured after logging in through CF Access.
#   2. Service Token — inject CF-Access headers on every request for machine-to-machine access.

TOKEN="YOUR_API_TOKEN_HERE"

# Approach 1: reuse a saved authenticated profile.
curl -X POST \
  "https://production-sfo.browserless.io/screenshot?token=${TOKEN}&profile=cf-access-profile" \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://internal.example.com/dashboard" }' \
  --output dashboard.png

# Approach 2: inject Service Token headers via setExtraHTTPHeaders.
# Headers must be set before navigation — each request to a CF Access-protected
# origin requires them.
curl -X POST \
  "https://production-sfo.browserless.io/content?token=${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://internal.example.com/dashboard",
    "setExtraHTTPHeaders": {
      "CF-Access-Client-Id": "YOUR_CF_CLIENT_ID.access",
      "CF-Access-Client-Secret": "YOUR_CF_CLIENT_SECRET"
    }
  }'
