# Extracts patient records from a sandbox healthcare portal using BQL.
#
# Install: pip install requests
# Run:     python healthcare_portal_extraction.py

import requests

query = """
mutation HealthcarePortal {
  goto(url: "https://scraping-sandbox.netlify.app/clarity-health", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ".patient-record", timeout: 10000) {
    time
  }
  patients: mapSelector(selector: ".patient-record") {
    name: mapSelector(selector: ".patient-name") { innerText }
    dob: mapSelector(selector: ".patient-dob") { innerText }
    provider: mapSelector(selector: ".patient-provider") { innerText }
    nextAppt: mapSelector(selector: ".patient-appointment") { innerText }
    status: mapSelector(selector: ".patient-status") { innerText }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/chromium/bql',
    params={'token': 'YOUR_API_TOKEN_HERE'},
    json={'query': query, 'variables': {}, 'operationName': 'HealthcarePortal'},
)

data = response.json()['data']
for patient in data['patients']:
    name = patient['name'][0]['innerText'] if patient['name'] else ''
    dob = patient['dob'][0]['innerText'] if patient['dob'] else ''
    provider = patient['provider'][0]['innerText'] if patient['provider'] else ''
    status = patient['status'][0]['innerText'] if patient['status'] else ''
    print(f'{name} | {dob} | {provider} | {status}')
