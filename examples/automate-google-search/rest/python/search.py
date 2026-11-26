# Searches Google and extracts result headings with a BQL mutation on the /stealth/bql endpoint.
# Stealth mode helps, but Google can still answer with a block or CAPTCHA page.
#
# Install: pip install requests
# Run:     python search.py

import requests

query = """
  mutation GoogleSearch {
    goto(url: "https://www.google.com/search?q=Browserless+headless+browser") {
      status
    }
    results: mapSelector(selector: "h3", wait: true) {
      innerText
    }
  }
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE',
    json={'query': query, 'variables': {}},
)

print(response.json())
