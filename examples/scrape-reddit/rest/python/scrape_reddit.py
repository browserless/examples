# Scrapes Reddit posts from a subreddit using BQL with stealth mode.
#
# Install: pip install requests
# Run:     python scrape_reddit.py

import requests

query = """
mutation ScrapeRedditPosts {
  goto(url: "https://www.reddit.com/r/programming/", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "shreddit-post", timeout: 15000) {
    time
  }
  posts: mapSelector(selector: "shreddit-post") {
    title: attribute(name: "post-title") { value }
    score: attribute(name: "score") { value }
    commentCount: attribute(name: "comment-count") { value }
    permalink: attribute(name: "permalink") { value }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={'query': query, 'variables': {}},
)

data = response.json()['data']
for post in data['posts']:
    title = post['title']['value']
    score = post['score']['value']
    comments = post['commentCount']['value']
    permalink = post['permalink']['value']
    print(f'{title} | {score} pts | {comments} comments | reddit.com{permalink}')
