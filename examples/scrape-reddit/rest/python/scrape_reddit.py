# Scrapes Reddit posts from a subreddit using BQL with stealth mode.
#
# Install: pip install requests
# Run:     python scrape_reddit.py

import requests

query = """
mutation ScrapeReddit {
  goto(url: "https://www.reddit.com/r/programming/", waitUntil: networkIdle) {
    status
  }
  waitForTimeout(time: 2000) {
    time
  }
  posts: mapSelector(selector: "article") {
    title: mapSelector(selector: "[id*='post-title']") {
      innerText
    }
    score: mapSelector(selector: "[id*='vote-arrows']") {
      innerText
    }
    comments: mapSelector(selector: "a[data-click-id='comments']") {
      innerText
    }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeReddit'},
)

data = response.json()['data']
for post in data['posts']:
    title = post['title'][0]['innerText'] if post['title'] else ''
    score = post['score'][0]['innerText'] if post['score'] else ''
    comments = post['comments'][0]['innerText'] if post['comments'] else ''
    print(f'{title}\n  Score: {score} | {comments}\n')
