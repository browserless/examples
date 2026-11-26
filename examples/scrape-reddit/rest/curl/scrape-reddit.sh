#!/usr/bin/env bash
# Scrapes Reddit posts from a subreddit using BQL with stealth mode.
# Run: bash scrape-reddit.sh

curl -X POST \
  "https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ScrapeRedditPosts { goto(url: \"https://www.reddit.com/r/programming/\", waitUntil: domContentLoaded) { status } waitForSelector(selector: \"shreddit-post\", timeout: 15000) { time } posts: mapSelector(selector: \"shreddit-post\") { title: attribute(name: \"post-title\") { value } score: attribute(name: \"score\") { value } commentCount: attribute(name: \"comment-count\") { value } permalink: attribute(name: \"permalink\") { value } } }",
    "variables": {}
  }'
