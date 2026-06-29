// Runs multiple DOM queries in a single BQL request — title, h1, meta description, and links.
// BQL executes all fields in one browser session, avoiding multiple round-trips.
//
// Run: node batch-dom-queries.mjs

const query = `mutation BatchDOMQueries {
  goto(url: "https://scraping-sandbox.netlify.app/products", waitUntil: networkIdle) {
    status
  }
  title {
    title
  }
  heading: text(selector: "h1") {
    text
  }
  description: attribute(selector: "meta[name='description']", name: "content") {
    value
  }
  links: mapSelector(selector: "a") {
    text: innerText
    href: attribute(name: "href") {
      value
    }
  }
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/bql?token=YOUR_API_TOKEN_HERE',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'BatchDOMQueries' }),
  }
);

const { data } = await response.json();
console.log('Title:', data.title.title);
console.log('H1:', data.heading.text);
console.log('Description:', data.description.value);
console.log('Links:', data.links.map((l) => ({ text: l.text, href: l.href?.value })));
