// Runs an end-to-end test against a remote Browserless browser using BQL.
//
// Run: node e2e-testing.mjs

const query = `mutation E2ETest {
  goto(url: "https://automationexercise.com", waitUntil: networkIdle) {
    status
  }
  title {
    title
  }
  verify: text(selector: "h2") {
    text
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'E2ETest' }),
  }
);

const { data } = await response.json();

console.assert(data.goto.status === 200, `Expected status 200, got ${data.goto.status}`);
console.assert(
  data.title.title.includes('Automation'),
  `Expected title to include "Automation", got: ${data.title.title}`
);

console.log('All assertions passed.');
console.log('Page title:', data.title.title);
console.log('H2 text:', data.verify.text);
