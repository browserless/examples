# Scrapes Glassdoor job listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_glassdoor.py

import requests

query = """
mutation ScrapeGlassdoor {
  goto(
    url: "https://www.glassdoor.com/Job/new-york-software-engineer-jobs-SRCH_IL.0,8_IC1132348_KO9,26.htm"
    waitUntil: networkIdle
  ) {
    status
  }
  jobs: mapSelector(selector: "[data-test='jobListing']") {
    title: mapSelector(selector: "a[data-test='job-title']") {
      innerText
    }
    company: mapSelector(selector: "[data-test='employer-name']") {
      innerText
    }
    location: mapSelector(selector: "[data-test='emp-location']") {
      innerText
    }
    salary: mapSelector(selector: "[data-test='detailSalary']") {
      innerText
    }
  }
}
"""

response = requests.post(
    'https://production-sfo.browserless.io/stealth/bql',
    params={
        'token': 'YOUR_API_TOKEN_HERE',
        'proxy': 'residential',
        'proxyCountry': 'us',
    },
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeGlassdoor'},
)

data = response.json()['data']
for job in data['jobs']:
    title = job['title'][0]['innerText'] if job['title'] else ''
    company = job['company'][0]['innerText'] if job['company'] else ''
    location = job['location'][0]['innerText'] if job['location'] else ''
    salary = job['salary'][0]['innerText'] if job['salary'] else ''
    print(f'{title} at {company} — {location} — {salary}')
