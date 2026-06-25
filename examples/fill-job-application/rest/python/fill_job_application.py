# Fills and submits a job application form on a sandbox site using BQL.
#
# Install: pip install requests
# Run:     python fill_job_application.py

import requests

query = """
mutation FillJobApplication {
  goto(url: "https://scraping-sandbox.netlify.app/helix", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: "form", timeout: 10000) {
    time
  }
  typeName: type(selector: "input[name=name]", text: "Jane Smith") {
    time
  }
  typeEmail: type(selector: "input[name=email]", text: "jane@example.com") {
    time
  }
  typePhone: type(selector: "input[name=phone]", text: "555-123-4567") {
    time
  }
  selectDept: select(selector: "select[name=department]", value: "Engineering") {
    selector
  }
  typeMessage: type(selector: "textarea[name=message]", text: "Excited to contribute to the team!") {
    time
  }
  submit: click(selector: "button[type=submit]") {
    time
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'FillJobApplication'},
)

print(response.json())
