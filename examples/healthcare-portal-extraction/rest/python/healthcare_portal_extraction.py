# Extracts patient medication records from a sandbox healthcare portal using BQL.
#
# Install: pip install requests
# Run:     python healthcare_portal_extraction.py

import requests

query = """
mutation HealthcarePortal {
  goto(url: "https://scraping-sandbox.netlify.app/clarity-health/patient-portal", waitUntil: networkIdle) {
    status
  }
  waitForLogin: waitForSelector(selector: "#patient-email", timeout: 10000) {
    time
  }
  typeEmail: type(selector: "#patient-email", text: "patient@example.com") {
    time
  }
  typePassword: type(selector: "#patient-password", text: "health2025") {
    time
  }
  submitLogin: click(selector: "#patient-login-submit") {
    time
  }
  waitForDashboard: waitForSelector(selector: "#medicationlist", timeout: 10000) {
    time
  }
  medications: mapSelector(selector: "#medicationlist table tbody tr") {
    medication: mapSelector(selector: "td:nth-child(1)") { innerText }
    dosage: mapSelector(selector: "td:nth-child(2)") { innerText }
    frequency: mapSelector(selector: "td:nth-child(3)") { innerText }
    prescriber: mapSelector(selector: "td:nth-child(4)") { innerText }
    refills: mapSelector(selector: "td:nth-child(5)") { innerText }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'HealthcarePortal'},
)

data = response.json()['data']
for med in data['medications']:
    name = med['medication'][0]['innerText'] if med['medication'] else ''
    dosage = med['dosage'][0]['innerText'] if med['dosage'] else ''
    frequency = med['frequency'][0]['innerText'] if med['frequency'] else ''
    prescriber = med['prescriber'][0]['innerText'] if med['prescriber'] else ''
    refills = med['refills'][0]['innerText'] if med['refills'] else ''
    print(f'{name} | {dosage} | {frequency} | {prescriber} | {refills}')
