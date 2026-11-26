// Scrapes title, channel, views, likes, and upload date from a YouTube video page using BQL with stealth mode.
//
// Run: node scrape-youtube.mjs

const query = `mutation ScrapeYouTubeVideo {
  goto(url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: "#view-count[aria-label]", timeout: 20000) {
    time
  }
  title: text(selector: "h1.ytd-watch-metadata yt-formatted-string") { text }
  channel: text(selector: "ytd-channel-name yt-formatted-string a") { text }
  views: mapSelector(selector: "#view-count") {
    label: attribute(name: "aria-label") { value }
  }
  likes: mapSelector(selector: "#top-level-buttons-computed like-button-view-model button") {
    label: attribute(name: "aria-label") { value }
  }
  uploadDate: text(selector: "#info-strings yt-formatted-string") { text }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {} }),
  }
);

const result = await response.json();
console.log(JSON.stringify(result, null, 2));
