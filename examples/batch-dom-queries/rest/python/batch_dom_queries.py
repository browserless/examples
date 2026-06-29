# Runs multiple DOM queries in a single BQL request — title, h1, meta description, and links.
# BQL executes all fields in one browser session, avoiding multiple round-trips.
#
# Install: pip install requests
# Run:     python batch_dom_queries.py

import requests

query = """
mutation BatchDOMQueries {
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
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'BatchDOMQueries'},
)

data = response.json()['data']
print('Title:', data['title']['title'])
print('H1:', data['heading']['text'])
print('Description:', data['description']['value'])
for link in data['links']:
    print(f"  {link['text']} -> {link['href']['value'] if link['href'] else ''}")
