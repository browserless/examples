#!/usr/bin/env bash
# Bypasses Cloudflare Turnstile and JS challenges via the Browserless /unblock endpoint.
# proxy=residential is strongly recommended — Cloudflare's bot detection is significantly
# harder to bypass from datacenter IPs.
#
# The response contains the fully unblocked page HTML.
# Set "screenshot": true or "cookies": true to include those in the response as well.

curl -X POST \
  "https://production-sfo.browserless.io/unblock?token=YOUR_API_TOKEN_HERE&proxy=residential" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.scrapingcourse.com/cloudflare-challenge",
    "content": true,
    "cookies": false,
    "screenshot": false,
    "browserWSEndpoint": false
  }'
