# Fills and submits a job application form on a sandbox site using BQL.
#
# Install: pip install requests
# Run:     python fill_job_application.py

import requests

query = """
mutation FillJobApplication {
  goto(url: "https://scraping-sandbox.netlify.app/helix/software-engineer-pipelines", waitUntil: networkIdle) {
    status
  }
  clickApplicationTab: click(selector: "button:nth-child(2)") {
    time
  }
  waitForInputs: waitForSelector(selector: "input[type=text]", timeout: 10000) {
    time
  }
  typeName: type(selector: "input[type=text]", text: "Jane Smith") {
    time
  }
  typeEmail: type(selector: "input[type=email]", text: "jane@example.com") {
    time
  }
  typeMessage: type(selector: "textarea", text: "Excited to contribute to the team!") {
    time
  }
  submit: click(selector: "div > button:only-of-type") {
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
