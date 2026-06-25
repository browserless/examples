# Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_indeed_jobs.py

import requests

query = """
mutation ScrapeIndeedJobs {
  goto(url: "https://www.indeed.com/jobs?q=data+scientist&l=Remote", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ".job_seen_beacon", timeout: 15000) {
    time
  }
  jobs: mapSelector(selector: ".job_seen_beacon") {
    title: mapSelector(selector: ".jobTitle a span") { innerText }
    company: mapSelector(selector: ".companyName") { innerText }
    location: mapSelector(selector: ".companyLocation") { innerText }
    salary: mapSelector(selector: ".salary-snippet-container") { innerText }
    snippet: mapSelector(selector: ".job-snippet") { innerText }
    link: mapSelector(selector: ".jobTitle a") {
      href: attribute(name: "href") { value }
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeIndeedJobs'},
)

data = response.json()['data']
for job in data['jobs']:
    title = job['title'][0]['innerText'] if job['title'] else ''
    company = job['company'][0]['innerText'] if job['company'] else ''
    location = job['location'][0]['innerText'] if job['location'] else ''
    salary = job['salary'][0]['innerText'] if job['salary'] else ''
    print(f'{title} — {company} — {location} — {salary}')
