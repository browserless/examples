# Fills and submits a form using BrowserQL — navigates, types, picks options,
# and clicks submit in a single request.
#
# Install: pip install requests
# Run:     python form.py

import json
import requests

query = """
mutation FormExample {
  goto(url: "https://httpbin.org/forms/post", waitUntil: domContentLoaded) {
    status
  }
  typeName: type(selector: "input[name=custname]", text: "Jane Doe") {
    time
  }
  typeEmail: type(selector: "input[name=custemail]", text: "jane@example.com") {
    time
  }
  chooseSize: click(selector: "input[value=medium]") {
    time
  }
  addTopping: checkbox(selector: "input[value=cheese]", checked: true) {
    time
  }
  typeComments: type(selector: "textarea[name=comments]", text: "Hello from Browserless!") {
    time
  }
  submitForm: click(selector: "form button") {
    time
  }
  response: text(selector: "body") {
    text
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'FormExample'},
)

data = response.json()['data']
# httpbin echoes the submission as JSON; `form` holds the posted fields.
print(json.dumps(json.loads(data['response']['text'])['form'], indent=2))
