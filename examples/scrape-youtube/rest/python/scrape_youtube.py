# Scrapes YouTube search results using BQL with stealth mode.
#
# Install: pip install requests
# Run:     python scrape_youtube.py

import requests

query = """
mutation ScrapeYouTube {
  goto(url: "https://www.youtube.com/results?search_query=javascript+tutorial", waitUntil: networkIdle) {
    status
  }
  waitForTimeout(time: 2000) {
    time
  }
  videos: mapSelector(selector: "ytd-video-renderer") {
    title: mapSelector(selector: "#video-title") {
      innerText
    }
    channel: mapSelector(selector: "[id='channel-name']") {
      innerText
    }
    views: mapSelector(selector: "span.inline-metadata-item") {
      innerText
    }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeYouTube'},
)

data = response.json()['data']
for video in data['videos']:
    title = video['title'][0]['innerText'] if video['title'] else ''
    channel = video['channel'][0]['innerText'] if video['channel'] else ''
    views = video['views'][0]['innerText'] if video['views'] else ''
    print(f'{title}\n  {channel} — {views}\n')
