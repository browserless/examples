#!/usr/bin/env bash
# Scrapes real estate agent names and profile URLs from a Zillow agent directory using BQL with stealth mode and residential proxy.
# Run: bash scrape-zillow.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxySticky=true&proxyCountry=us&humanlike=true&blockAds=true" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeZillow { goto(url: \"https://www.zillow.com/professionals/real-estate-agent-reviews/new-york-ny/\", waitUntil: networkIdle) { status } waitForTimeout(time: 3000) { time } agents: mapSelector(selector: \"a[href*='\''\/profile\/'\'']\" ) { name: mapSelector(selector: \"h2\") { innerText } profileUrl: attribute(name: \"href\") { value } } }",
    "variables": {},
    "operationName": "ScrapeZillow"
  }'
