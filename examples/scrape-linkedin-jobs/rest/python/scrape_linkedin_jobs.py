# Scrapes LinkedIn job listings using BQL with stealth mode and residential proxy.
#
# Install: pip install requests
# Run:     python scrape_linkedin_jobs.py

import requests

query = """
mutation ScrapeLinkedInJobs {
  goto(url: "https://www.linkedin.com/jobs/search/?keywords=software+engineer&location=United+States", waitUntil: networkIdle) {
    status
  }
  waitForSelector(selector: ".base-card", timeout: 15000) {
    time
  }
  jobs: mapSelector(selector: ".base-card") {
    title: mapSelector(selector: ".base-search-card__title") { innerText }
    company: mapSelector(selector: ".base-search-card__subtitle a") { innerText }
    location: mapSelector(selector: ".job-search-card__location") { innerText }
    posted: mapSelector(selector: "time") { innerText }
    link: mapSelector(selector: "a.base-card__full-link") {
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
    json={'query': query, 'variables': {}, 'operationName': 'ScrapeLinkedInJobs'},
)

data = response.json()['data']
for job in data['jobs']:
    title = job['title'][0]['innerText'] if job['title'] else ''
    company = job['company'][0]['innerText'] if job['company'] else ''
    location = job['location'][0]['innerText'] if job['location'] else ''
    print(f'{title} — {company} — {location}')
