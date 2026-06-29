# Dismisses cookie consent banners via a BQL mutation before capturing a screenshot.
# if returns null (not an error) when the selector is absent — safe on pages with no banner.
#
# For sites covered by major consent platforms (OneTrust, CookieBot, etc.), you can also
# use the simpler blockConsentModals=true query parameter on /screenshot or /pdf instead.
#
# Install: pip install requests
# Run:     python cookies.py

import base64
import requests

query = """mutation AcceptCookies {
  # waitUntil: networkIdle ensures the page is fully settled before the if check runs.
  # if returns null (not an error) when the selector is absent, so this is safe on
  # pages with no banner.
  goto(url: "https://scraping-sandbox.netlify.app/clarity-health", waitUntil: networkIdle) {
    status
  }
  if(selector: "[id*=accept], [class*=accept], button[id*=cookie]", visible: true) {
    acceptBtn: click(selector: "[id*=accept], [class*=accept], button[id*=cookie]") {
      time
    }
  }
  screenshot {
    base64
  }
}"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql?token=YOUR_API_TOKEN_HERE',
    json={'query': query, 'operationName': 'AcceptCookies'},
)

data = response.json()['data']
if data.get('screenshot', {}).get('base64'):
    with open('page.png', 'wb') as f:
        f.write(base64.b64decode(data['screenshot']['base64']))
    print('Screenshot saved to page.png')
