#!/usr/bin/env bash
# Scrapes GitHub trending repositories using BQL.
# Run: bash scrape-github-trending.sh

curl -X POST \
  "https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeGitHubTrending { goto(url: \"https://github.com/trending\", waitUntil: networkIdle) { status } waitForSelector(selector: \"article.Box-row\", timeout: 15000) { time } repos: mapSelector(selector: \"article.Box-row\") { name: mapSelector(selector: \"h2 a\") { innerText } description: mapSelector(selector: \"p\") { innerText } language: mapSelector(selector: \"[itemprop=programmingLanguage]\") { innerText } stars: mapSelector(selector: \"a[href*=stargazers]\") { innerText } forks: mapSelector(selector: \"a[href*=forks]\") { innerText } todayStars: mapSelector(selector: \"span.d-inline-block.float-sm-right\") { innerText } } }",
    "variables": {},
    "operationName": "ScrapeGitHubTrending"
  }'
