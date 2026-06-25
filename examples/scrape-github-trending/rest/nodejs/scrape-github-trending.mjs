// Scrapes GitHub trending repositories using BQL.
//
// Run: node scrape-github-trending.mjs

const query = `mutation ScrapeGitHubTrending {
  goto(url: "https://github.com/trending", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "article.Box-row", timeout: 15000) {
    time
  }
  repos: mapSelector(selector: "article.Box-row") {
    name: mapSelector(selector: "h2 a") { innerText }
    description: mapSelector(selector: "p") { innerText }
    language: mapSelector(selector: "[itemprop=programmingLanguage]") { innerText }
    stars: mapSelector(selector: "a[href*=stargazers]") { innerText }
    forks: mapSelector(selector: "a[href*=forks]") { innerText }
    todayStars: mapSelector(selector: "span.d-inline-block.float-sm-right") { innerText }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeGitHubTrending' }),
  }
);

const { data } = await response.json();
const repos = data.repos.map((r) => ({
  name: r.name?.[0]?.innerText?.trim() ?? '',
  description: r.description?.[0]?.innerText ?? '',
  language: r.language?.[0]?.innerText ?? '',
  stars: r.stars?.[0]?.innerText?.trim() ?? '',
}));
console.log(JSON.stringify(repos, null, 2));
