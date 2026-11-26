// Scrapes real estate agent names and profile URLs from a Zillow agent directory using BQL with stealth mode and residential proxy.
//
// Run: node scrape-zillow.mjs

const query = `mutation ScrapeZillow {
  goto(
    url: "https://www.zillow.com/professionals/real-estate-agent-reviews/new-york-ny/"
    waitUntil: networkIdle
  ) {
    status
  }
  waitForTimeout(time: 3000) {
    time
  }
  agents: mapSelector(selector: "a[href*='/profile/']") {
    name: mapSelector(selector: "h2") {
      innerText
    }
    profileUrl: attribute(name: "href") {
      value
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxySticky=true&proxyCountry=us&humanlike=true&blockAds=true',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeZillow' }),
  }
);

const { data } = await response.json();
const agents = data.agents.map((a) => ({
  name: a.name?.[0]?.innerText ?? '',
  profileUrl: a.profileUrl?.value ?? '',
}));
console.log(JSON.stringify(agents, null, 2));
