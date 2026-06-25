// Scrapes Indeed job listings using BQL with stealth mode and residential proxy.
//
// Run: node scrape-indeed-jobs.mjs

const query = `mutation ScrapeIndeedJobs {
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
}`;

const response = await fetch(
  'https://production-sfo.browserless.io/stealth/bql?token=YOUR_API_TOKEN_HERE&proxy=residential&proxyCountry=us',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {}, operationName: 'ScrapeIndeedJobs' }),
  }
);

const { data } = await response.json();
const jobs = data.jobs.map((j) => ({
  title: j.title?.[0]?.innerText ?? '',
  company: j.company?.[0]?.innerText ?? '',
  location: j.location?.[0]?.innerText ?? '',
  salary: j.salary?.[0]?.innerText ?? '',
}));
console.log(JSON.stringify(jobs, null, 2));
