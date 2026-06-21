// Scrapes Reddit posts from a subreddit using BQL with stealth mode.
//
// Run: node scrape-reddit.mjs

const query = `mutation ScrapeReddit {
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
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeReddit' }),
  }
);

const { data } = await response.json();
const posts = data.posts.map((p) => ({
  title: p.title?.[0]?.innerText ?? '',
  score: p.score?.[0]?.innerText ?? '',
  comments: p.comments?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(posts, null, 2));
