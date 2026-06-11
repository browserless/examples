# Fills and submits a form using BrowserQL — navigates, types, selects, solves a CAPTCHA,
# and clicks submit in a single request.
#
# Install: pip install requests
# Run:     python form.py

import requests

endpoint = 'https://production-sfo.browserless.io/chromium/bql'
params = {'token': 'YOUR_API_TOKEN_HERE'}
headers = {'Content-Type': 'application/json'}
payload = {
    'query': """mutation FormExample {
  goto(url: "https://www.browserless.io/practice-form") {
    status
  }
  typeEmail: type(text: "user@example.com", selector: "#Email") {
    time
  }
  typeMessage: type(selector: "#Message", text: "Hello from Browserless!") {
    time
  }
  subject: select(selector: "select#Subject", value: "Support") {
    selector
  }
  solve {
    time
    solved
  }
  submitForm: click(selector: "button[type='submit']") {
    time
  }
}""",
    'variables': {},
    'operationName': 'FormExample',
}

response = requests.post(endpoint, params=params, headers=headers, json=payload)
print(response.json())
