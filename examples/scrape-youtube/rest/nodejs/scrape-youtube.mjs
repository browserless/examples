// Scrapes YouTube search results using BQL with stealth mode.
//
// Run: node scrape-youtube.mjs

const query = `mutation ScrapeYouTube {
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
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeYouTube' }),
  }
);

const { data } = await response.json();
const videos = data.videos.map((v) => ({
  title: v.title?.[0]?.innerText ?? '',
  channel: v.channel?.[0]?.innerText ?? '',
  views: v.views?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(videos, null, 2));
