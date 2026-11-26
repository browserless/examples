// Scrapes IMDb top movie ratings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-imdb.mjs

const query = `mutation ScrapeIMDb {
  goto(url: "https://www.imdb.com/chart/top/", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: ".ipc-metadata-list-summary-item", timeout: 15000) {
    time
  }
  movies: mapSelector(selector: ".ipc-metadata-list-summary-item") {
    title: mapSelector(selector: ".ipc-title__text") { innerText }
    metadata: mapSelector(selector: ".cli-title-metadata li") { innerText }
    rating: mapSelector(selector: ".ipc-rating-star--imdb") {
      ratingLabel: attribute(name: "aria-label") { value }
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {} }),
  }
);

const { data } = await response.json();
console.log(JSON.stringify(data.movies, null, 2));
