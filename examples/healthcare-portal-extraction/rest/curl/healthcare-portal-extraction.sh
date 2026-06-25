#!/usr/bin/env bash
# Extracts patient records from a sandbox healthcare portal using BQL.
# Run: bash healthcare-portal-extraction.sh

curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation HealthcarePortal { goto(url: \"https://scraping-sandbox.netlify.app/clarity-health\", waitUntil: networkIdle) { status } waitForSelector(selector: \".patient-record\", timeout: 10000) { time } patients: mapSelector(selector: \".patient-record\") { name: mapSelector(selector: \".patient-name\") { innerText } dob: mapSelector(selector: \".patient-dob\") { innerText } provider: mapSelector(selector: \".patient-provider\") { innerText } nextAppt: mapSelector(selector: \".patient-appointment\") { innerText } status: mapSelector(selector: \".patient-status\") { innerText } } }",
    "variables": {},
    "operationName": "HealthcarePortal"
  }'
