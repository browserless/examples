#!/usr/bin/env bash
# Scrapes Glassdoor job listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-glassdoor.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeGlassdoor { goto(url: \"https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm\", waitUntil: networkIdle) { status } jobs: mapSelector(selector: \"[data-test='\''jobListing'\'']\") { title: mapSelector(selector: \"a[data-test='\''job-title'\'']\") { innerText } company: mapSelector(selector: \"[data-test='\''employer-name'\'']\") { innerText } location: mapSelector(selector: \"[data-test='\''emp-location'\'']\") { innerText } salary: mapSelector(selector: \"[data-test='\''detailSalary'\'']\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeGlassdoor"
  }'
