// Clicks a link and waits for navigation to complete using BQL.
//
// Run: node navigate-after-click.mjs

const query = `mutation NavigateAfterClick {
  goto(url: "https://scraping-sandbox.netlify.app/products", waitUntil: networkIdle) {
    status
  }
  click(selector: "a", waitForNavigation: true) {
    time
  }
  title {
    title
  }
  currentURL {
    url
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'NavigateAfterClick' }),
  }
);

const { data } = await response.json();
console.log('Navigated to:', data.currentURL.url);
console.log('Page title:', data.title.title);
