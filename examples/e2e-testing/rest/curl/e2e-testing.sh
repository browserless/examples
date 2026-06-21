#!/usr/bin/env bash
# Runs an end-to-end test against a remote Browserless browser using BQL.
# Run: bash e2e-testing.sh

curl -X POST \
  "https://production-sfo.browserless.io/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation E2ETest { goto(url: \"https://automationexercise.com\", waitUntil: networkIdle) { status } title { title } verify: text(selector: \"h2\") { text } }",
    "variables": {},
    "operationName": "E2ETest"
  }'
