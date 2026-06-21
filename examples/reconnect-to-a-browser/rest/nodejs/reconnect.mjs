// Disconnects from a Browserless browser session and reconnects to the same session.
// Uses BQL over HTTP — no browser library required.
//
// Run: node reconnect.mjs

const TOKEN = 'YOUR_API_TOKEN_HERE';
const BQL_URL = `https://production-sfo.browserless.io/stealth/bql?token=${TOKEN}`;

const startQuery = `mutation StartSession {
  goto(url: "https://example.com", waitUntil: domContentLoaded) {
    status
  }
  reconnect(timeout: 60000) {
    browserQLEndpoint
  }
}`;

const startResponse = await fetch(BQL_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: startQuery,
    variables: {},
    operationName: 'StartSession',
  }),
});

const { data } = await startResponse.json();
const reconnectURL = `${data.reconnect.browserQLEndpoint}?token=${TOKEN}`;

const continueResponse = await fetch(reconnectURL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'mutation ContinueSession { html { html } }',
    variables: {},
    operationName: 'ContinueSession',
  }),
});

const result = await continueResponse.json();
console.log(result.data.html.html.substring(0, 200));
