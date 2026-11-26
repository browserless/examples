# Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_indeed_jobs.py

import requests

query = """
mutation ScrapeIndeedJobs {
  goto(url: "https://www.indeed.com/jobs?q=data+scientist&l=Remote", waitUntil: domContentLoaded) {
    status
  }
  waitForSelector(selector: ".job_seen_beacon", timeout: 15000) {
    time
  }
  jobs: mapSelector(selector: ".job_seen_beacon") {
    title: mapSelector(selector: ".jobTitle a span") { innerText }
    company: mapSelector(selector: "[data-testid=company-name]") { innerText }
    location: mapSelector(selector: "[data-testid=text-location]") { innerText }
    salary: mapSelector(selector: ".salary-snippet-container") { innerText }
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
    json={'query': query, 'variables': {}},
)

data = response.json()['data']
for job in data['jobs']:
    title = job['title'][0]['innerText']
    company = job['company'][0]['innerText']
    location = job['location'][0]['innerText']
    salary = job['salary'][0]['innerText'] if job['salary'] else 'Not listed'
    print(f'{title} at {company} ({location}) - {salary}')
