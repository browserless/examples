#!/usr/bin/env bash
# Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
# Run: bash scrape-indeed-jobs.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeIndeedJobs { goto(url: \"https://www.indeed.com/jobs?q=data+scientist&l=Remote\", waitUntil: domContentLoaded) { status } waitForSelector(selector: \".job_seen_beacon\", timeout: 15000) { time } jobs: mapSelector(selector: \".job_seen_beacon\") { title: mapSelector(selector: \".jobTitle a span\") { innerText } company: mapSelector(selector: \"[data-testid=company-name]\") { innerText } location: mapSelector(selector: \"[data-testid=text-location]\") { innerText } salary: mapSelector(selector: \".salary-snippet-container\") { innerText } link: mapSelector(selector: \".jobTitle a\") { href: attribute(name: \"href\") { value } } } }",
    "variables": {}
  }'
